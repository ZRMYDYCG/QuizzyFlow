/**
 * 从 Vercel AI SDK UIMessage 的 tool parts 提取可执行的 AIAction
 */

import { isToolUIPart, type UIMessage } from 'ai'
import { nanoid } from 'nanoid'
import { AIAction, AIActionType } from '../types'

interface ToolOutputPayload {
  actionType?: string
  data?: unknown
  description?: string
  error?: string
  status?: string
}

function parseToolOutput(output: unknown): ToolOutputPayload | null {
  if (output == null) return null
  if (typeof output === 'string') {
    try {
      return JSON.parse(output) as ToolOutputPayload
    } catch {
      return null
    }
  }
  if (typeof output === 'object') {
    return output as ToolOutputPayload
  }
  return null
}

const ACTION_TYPE_MAP: Record<string, AIActionType> = {
  add_component: 'add_component',
  update_component: 'update_component',
  delete_component: 'delete_component',
  suggest_improvement: 'suggest_improvement',
}

function resolveActionType(
  payload: ToolOutputPayload,
  toolType: string,
): AIActionType | undefined {
  if (payload.actionType && ACTION_TYPE_MAP[payload.actionType]) {
    return ACTION_TYPE_MAP[payload.actionType]
  }
  const fromTool = toolType.replace(/^tool-/, '').replace(/^propose_/, '')
  return ACTION_TYPE_MAP[fromTool]
}

export function extractActionsFromUIMessage(message: UIMessage): AIAction[] {
  const actions: AIAction[] = []
  const parts = message.parts ?? []

  for (const part of parts) {
    if (!isToolUIPart(part)) continue
    if (part.state !== 'output-available' || part.output == null) continue

    const payload = parseToolOutput(part.output)
    if (!payload || payload.error) continue

    const mapped = resolveActionType(payload, part.type)
    if (!mapped) continue

    const toolPart = part as { toolCallId?: string }

    if (mapped === 'suggest_improvement') {
      actions.push({
        id: toolPart.toolCallId ?? nanoid(10),
        type: 'suggest_improvement',
        data: payload.data ?? payload,
        description: payload.description,
      })
      continue
    }

    if (payload.data) {
      actions.push({
        id: toolPart.toolCallId ?? nanoid(10),
        type: mapped,
        data: payload.data,
        description: payload.description,
        applied: false,
      })
    }
  }

  return actions
}

export function getTextFromUIMessage(message: UIMessage): string {
  const parts = message.parts ?? []
  const textParts = parts
    .filter((p) => p.type === 'text')
    .map((p) => (p as { text: string }).text)
  if (textParts.length > 0) {
    return textParts.join('')
  }
  return ''
}

export function uiMessageToLocalMessage(
  message: UIMessage,
  isStreaming?: boolean,
): import('../types').Message {
  const actions =
    message.role === 'assistant' ? extractActionsFromUIMessage(message) : undefined
  return {
    id: message.id,
    role: message.role as 'user' | 'assistant' | 'system',
    content: getTextFromUIMessage(message),
    timestamp: Date.now(),
    actions: actions?.length ? actions : undefined,
    isStreaming,
  }
}
