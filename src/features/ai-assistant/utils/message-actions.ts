/**
 * 消息与操作提案的合并、持久化字段处理
 */

import type { UIMessage } from 'ai'
import { nanoid } from 'nanoid'
import { AIAction, Message } from '../types'
import { extractActionsFromUIMessage, getTextFromUIMessage } from './tool-parts'

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

export function mapDbMessageToLocal(msg: {
  id: string
  role: string
  content: string
  timestamp: number
  actions?: AIAction[]
}): Message {
  return {
    id: msg.id,
    role: msg.role as Message['role'],
    content: msg.content,
    timestamp: msg.timestamp,
    actions: msg.actions?.length
      ? msg.actions.map((a) => ({
          ...a,
          id: a.id || (a as { actionId?: string }).actionId || nanoid(10),
          applied: !!a.applied,
        }))
      : undefined,
  }
}

export function dbMessagesToUIMessages(messages: Message[]): UIMessage[] {
  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    parts: [{ type: 'text' as const, text: msg.content }],
  }))
}

export function mergeUiIntoChatMessages(
  uiMessages: UIMessage[],
  previous: Message[],
  isStreaming: boolean,
): Message[] {
  const lastUiId = uiMessages[uiMessages.length - 1]?.id

  return uiMessages.map((ui) => {
    const prev = previous.find((p) => p.id === ui.id)
    const streaming =
      isStreaming && ui.role === 'assistant' && ui.id === lastUiId

    const extracted =
      ui.role === 'assistant' ? extractActionsFromUIMessage(ui) : []

    let actions: AIAction[] | undefined
    if (extracted.length > 0) {
      actions = ensureActionIds(extracted, prev?.actions)
    } else if (prev?.actions?.length) {
      actions = prev.actions
    }

    return {
      id: ui.id,
      role: ui.role as Message['role'],
      content: getTextFromUIMessage(ui) || prev?.content || '',
      timestamp: prev?.timestamp ?? Date.now(),
      actions,
      isStreaming: streaming,
    }
  })
}

export function toSyncMessageDto(messages: Message[]) {
  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp,
    actions: msg.actions?.map((a) => ({
      id: a.id || (a as { actionId?: string }).actionId || nanoid(10),
      type: a.type,
      data: a.data,
      description: a.description,
      applied: !!a.applied,
      appliedAt: a.appliedAt,
    })),
  }))
}
