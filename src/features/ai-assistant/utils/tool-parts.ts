/**
 * 从 Vercel AI SDK UIMessage 的 tool parts 提取可执行的 AIAction
 */

import { isToolUIPart, type UIMessage } from 'ai'
import { nanoid } from 'nanoid'
import { AIAction, AIActionType, ToolCallDisplay, ToolCallKind, ToolCallState, FollowUpGuide } from '../types'
import { isFollowUpGuide } from './follow-up'

interface ToolOutputPayload {
  actionType?: string
  data?: unknown
  description?: string
  error?: string
  status?: string
  skillId?: string
  skillName?: string
  summary?: string
  matches?: unknown
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
  follow_up: 'follow_up',
}

const TOOL_DISPLAY_NAMES: Record<string, string> = {
  propose_add_component: '添加组件提案',
  propose_update_component: '更新组件提案',
  propose_delete_component: '删除组件提案',
  suggest_improvement: '优化建议',
  suggest_follow_up: '引导追问',
  skill_find_skills: 'Skill 匹配',
  skill_analyze_questionnaire: '问卷结构分析',
  skill_list_materials: '物料库查询',
  skill_get_component_info: '组件详情查询',
  skill_check_quality: '问卷质量检查',
}

function resolveToolName(partType: string): string {
  return partType.replace(/^tool-/, '')
}

function resolveToolKind(toolName: string): ToolCallKind {
  if (toolName.startsWith('skill_')) return 'skill'
  if (
    toolName.startsWith('propose_') ||
    toolName === 'suggest_improvement'
  ) {
    return 'component'
  }
  return 'unknown'
}

function resolveDisplayName(toolName: string, payload?: ToolOutputPayload | null): string {
  if (payload?.skillName) return payload.skillName
  return TOOL_DISPLAY_NAMES[toolName] ?? toolName
}

function mapPartState(part: { state?: string; output?: unknown; errorText?: string }): ToolCallState {
  const state = part.state ?? ''
  if (part.errorText || state.includes('error')) return 'error'
  if (state === 'output-available' && part.output != null) return 'completed'
  if (state === 'output-streaming') return 'running'
  if (state === 'input-available' || state === 'input-streaming') return 'running'
  if (state === 'partial-call') return 'running'
  return 'pending'
}

function resolveActionType(
  payload: ToolOutputPayload,
  toolType: string,
): AIActionType | undefined {
  if (payload.actionType && ACTION_TYPE_MAP[payload.actionType]) {
    return ACTION_TYPE_MAP[payload.actionType]
  }
  const toolName = toolType.replace(/^tool-/, '')
  if (toolName === 'suggest_follow_up') return 'follow_up'
  const fromTool = toolName.replace(/^propose_/, '')
  return ACTION_TYPE_MAP[fromTool]
}

/** 从 suggest_follow_up tool part 提取引导表单（支持 input / output） */
export function extractFollowUpFromUIMessage(message: UIMessage): {
  guide: FollowUpGuide
  actionId: string
} | null {
  for (const part of message.parts ?? []) {
    if (!isToolUIPart(part)) continue

    const toolPart = part as {
      type: string
      state?: string
      input?: unknown
      output?: unknown
      toolCallId?: string
      errorText?: string
    }

    const toolName = resolveToolName(toolPart.type)
    if (toolName !== 'suggest_follow_up') continue
    if (toolPart.errorText || toolPart.state?.includes('error')) continue

    let guide: unknown = null
    if (toolPart.output != null) {
      const payload = parseToolOutput(toolPart.output)
      guide = payload?.data ?? payload
    }
    if (!isFollowUpGuide(guide) && isFollowUpGuide(toolPart.input)) {
      guide = toolPart.input
    }
    if (!isFollowUpGuide(guide)) continue

    return {
      guide,
      actionId: toolPart.toolCallId ?? nanoid(10),
    }
  }
  return null
}

export function extractToolCallsFromUIMessage(message: UIMessage): ToolCallDisplay[] {
  const parts = message.parts ?? []
  const calls: ToolCallDisplay[] = []

  for (const part of parts) {
    if (!isToolUIPart(part)) continue

    const toolPart = part as {
      type: string
      state?: string
      input?: unknown
      output?: unknown
      toolCallId?: string
      errorText?: string
    }

    const toolName = resolveToolName(toolPart.type)
    const payload = parseToolOutput(toolPart.output)
    const state = mapPartState(toolPart)

    calls.push({
      id: toolPart.toolCallId ?? `${toolName}-${calls.length}`,
      toolName,
      displayName: resolveDisplayName(toolName, payload),
      kind: resolveToolKind(toolName),
      state,
      input: toolPart.input,
      output: toolPart.output,
      summary: payload?.summary || payload?.description,
      error: payload?.error || toolPart.errorText,
    })
  }

  return calls
}

export function extractActionsFromUIMessage(message: UIMessage): AIAction[] {
  const actions: AIAction[] = []
  const parts = message.parts ?? []

  for (const part of parts) {
    if (!isToolUIPart(part)) continue
    if (part.state !== 'output-available' || part.output == null) continue

    const payload = parseToolOutput(part.output)
    if (!payload || payload.error) continue

    // Skill 结果仅展示，不进入操作提案
    if (
      payload.actionType === 'skill_result' ||
      payload.actionType === 'skill_match'
    ) {
      continue
    }

    const mapped = resolveActionType(payload, part.type)
    if (!mapped) continue

    const toolPart = part as { toolCallId?: string }

    if (mapped === 'follow_up') {
      continue
    }

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

export function getReasoningFromUIMessage(message: UIMessage): string {
  const parts = message.parts ?? []
  return parts
    .filter((p) => p.type === 'reasoning')
    .map((p) => (p as { text: string }).text)
    .join('')
}

export function isReasoningStreamingPart(message: UIMessage, isLoading: boolean): boolean {
  if (!isLoading || message.role !== 'assistant') return false
  const parts = message.parts ?? []
  const lastPart = parts[parts.length - 1]
  if (lastPart?.type !== 'reasoning') return false
  // 已有正文时不再显示「思考中」
  const hasText = parts.some(
    (p) => p.type === 'text' && (p as { text: string }).text?.trim(),
  )
  return !hasText
}

export function uiMessageToLocalMessage(
  message: UIMessage,
  isStreaming?: boolean,
): import('../types').Message {
  const actions =
    message.role === 'assistant' ? extractActionsFromUIMessage(message) : undefined
  const toolCalls =
    message.role === 'assistant' ? extractToolCallsFromUIMessage(message) : undefined
  return {
    id: message.id,
    role: message.role as 'user' | 'assistant' | 'system',
    content: getTextFromUIMessage(message),
    reasoning: getReasoningFromUIMessage(message) || undefined,
    timestamp: Date.now(),
    actions: actions?.length ? actions : undefined,
    toolCalls: toolCalls?.length ? toolCalls : undefined,
    isStreaming,
  }
}
