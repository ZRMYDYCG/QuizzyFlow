/**
 * 消息与操作提案的合并、持久化字段处理
 */

import type { UIMessage } from 'ai'
import { nanoid } from 'nanoid'
import { AIAction, AIContext, Message } from '../types'
import {
  attachFallbackFollowUp,
  mergeFollowUpIntoActions,
  splitFollowUpFromActions,
} from './follow-up'
import {
  extractActionsFromUIMessage,
  extractFollowUpFromUIMessage,
  extractToolCallsFromUIMessage,
  getTextFromUIMessage,
  getReasoningFromUIMessage,
  isReasoningStreamingPart,
} from './tool-parts'

export function ensureActionIds(
  actions: AIAction[],
  previous?: AIAction[],
): AIAction[] {
  return actions.map((action, index) => {
    if (action.id) {
      const prev = previous?.find((p) => p.id === action.id)
      if (prev) {
        return {
          ...action,
          applied: prev.applied,
          appliedAt: prev.appliedAt,
        }
      }
      return action
    }

    const prevByIndex = previous?.[index]
    return {
      ...action,
      id: prevByIndex?.id ?? nanoid(10),
      applied: prevByIndex?.applied,
      appliedAt: prevByIndex?.appliedAt,
    }
  })
}

function enrichMessageWithFollowUp(
  base: Message,
  previous?: Message,
  uiFollowUp?: ReturnType<typeof extractFollowUpFromUIMessage>,
): Message {
  const mergedActions = base.actions ?? previous?.actions
  const split = splitFollowUpFromActions(mergedActions)

  const followUpUsed =
    split.followUpUsed ?? previous?.followUpUsed ?? false

  return {
    ...base,
    actions: split.actions,
    followUp:
      followUpUsed
        ? previous?.followUp
        : uiFollowUp?.guide ?? split.followUp ?? previous?.followUp,
    followUpActionId:
      uiFollowUp?.actionId ??
      split.followUpActionId ??
      previous?.followUpActionId,
    followUpUsed,
  }
}

export function mapDbMessageToLocal(msg: {
  id: string
  role: string
  content: string
  reasoning?: string
  timestamp: number
  actions?: AIAction[]
}): Message {
  const actions = msg.actions?.length
    ? msg.actions.map((a) => ({
        ...a,
        id: a.id || (a as { actionId?: string }).actionId || nanoid(10),
        applied: !!a.applied,
      }))
    : undefined

  return enrichMessageWithFollowUp({
    id: msg.id,
    role: msg.role as Message['role'],
    content: msg.content,
    reasoning: msg.reasoning || undefined,
    timestamp: msg.timestamp,
    actions,
  })
}

export function dbMessagesToUIMessages(messages: Message[]): UIMessage[] {
  return messages.map((msg) => {
    const parts: UIMessage['parts'] = []
    if (msg.reasoning?.trim()) {
      parts.push({ type: 'reasoning' as const, text: msg.reasoning, state: 'done' as const })
    }
    parts.push({ type: 'text' as const, text: msg.content })
    return {
      id: msg.id,
      role: msg.role,
      parts,
    }
  })
}

export function mergeUiIntoChatMessages(
  uiMessages: UIMessage[],
  previous: Message[],
  isStreaming: boolean,
  context?: AIContext,
): Message[] {
  const lastUiId = uiMessages[uiMessages.length - 1]?.id

  const merged = uiMessages.map((ui) => {
    const prev = previous.find((p) => p.id === ui.id)
    const streaming =
      isStreaming && ui.role === 'assistant' && ui.id === lastUiId

    const extracted =
      ui.role === 'assistant' ? extractActionsFromUIMessage(ui) : []

    const extractedToolCalls =
      ui.role === 'assistant' ? extractToolCallsFromUIMessage(ui) : []

    const uiFollowUp =
      ui.role === 'assistant' ? extractFollowUpFromUIMessage(ui) : null

    let actions: AIAction[] | undefined
    if (extracted.length > 0) {
      actions = ensureActionIds(extracted, prev?.actions)
    } else if (prev?.actions?.length) {
      actions = prev.actions
    }

    const toolCalls = extractedToolCalls.length > 0 ? extractedToolCalls : prev?.toolCalls

    return enrichMessageWithFollowUp(
      {
        id: ui.id,
        role: ui.role as Message['role'],
        content: getTextFromUIMessage(ui) || prev?.content || '',
        reasoning: getReasoningFromUIMessage(ui) || prev?.reasoning || undefined,
        timestamp: prev?.timestamp ?? Date.now(),
        actions,
        toolCalls: toolCalls?.length ? toolCalls : undefined,
        isStreaming: streaming,
        isReasoningStreaming:
          isStreaming && ui.role === 'assistant' && isReasoningStreamingPart(ui, isStreaming),
      },
      prev,
      uiFollowUp,
    )
  })

  return attachFallbackFollowUp(merged, previous, context, isStreaming)
}

export function resolvePersistContent(msg: Pick<Message, 'content' | 'role' | 'actions'>): string {
  const text = (msg.content ?? '').trim()
  if (text) return msg.content ?? text

  if (msg.actions?.length) {
    const desc = msg.actions
      .map((a) => a.description)
      .filter(Boolean)
      .join('；')
    if (desc) return desc
    return '已生成操作提案'
  }

  if (msg.role === 'assistant') return '（助手回复）'
  if (msg.role === 'user') return '（用户消息）'
  return '（系统消息）'
}

export function toSyncMessageDto(messages: Message[]) {
  return messages
    .filter((msg) => !msg.isStreaming)
    .map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: resolvePersistContent(msg),
      reasoning: msg.reasoning?.trim() || undefined,
      timestamp: msg.timestamp,
      actions: mergeFollowUpIntoActions(msg)?.map((a) => ({
        id: a.id || (a as { actionId?: string }).actionId || nanoid(10),
        type: a.type,
        data: a.data,
        description: a.description,
        applied: !!a.applied,
        appliedAt: a.appliedAt,
      })),
    }))
}
