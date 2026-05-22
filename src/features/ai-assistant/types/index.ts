/**
 * AI Assistant Types
 * AI 助手相关的类型定义
 */

// ==================== 消息类型 ====================

/** 用户消息引用的问卷组件（token 优化后的精简 JSON） */
export interface AttachedComponentRef {
  fe_id: string
  type: string
  title: string
  props?: Record<string, unknown>
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  reasoning?: string
  timestamp: number
  /** 用户消息附带的问卷组件引用 */
  attachedComponents?: AttachedComponentRef[]
  actions?: AIAction[]
  toolCalls?: ToolCallDisplay[]
  followUp?: FollowUpGuide
  followUpActionId?: string
  followUpUsed?: boolean
  /** 展示用正文（已剥离引导追问段落，不影响持久化 content） */
  contentDisplay?: string
  isStreaming?: boolean
  isReasoningStreaming?: boolean
}

// ==================== Tool Call 展示 ====================

export type ToolCallState =
  | 'pending'
  | 'running'
  | 'completed'
  | 'error'

export type ToolCallKind = 'component' | 'skill' | 'unknown'

export interface ToolCallDisplay {
  id: string
  toolName: string
  displayName: string
  kind: ToolCallKind
  state: ToolCallState
  input?: unknown
  output?: unknown
  summary?: string
  error?: string
}

// ==================== AI 上下文 ====================

export interface AIContext {
  questionId?: string
  questionTitle?: string
  questionDesc?: string
  currentComponents?: ComponentData[]
  componentLibrary: ComponentDefinition[]
  selectedComponentId?: string
}

export interface ComponentData {
  fe_id: string
  type: string
  title: string
  props: Record<string, any>
  [key: string]: any
}

// ==================== 组件库定义 ====================

export interface ComponentDefinition {
  type: string
  label: string
  category: 'input' | 'choice' | 'display' | 'layout' | 'advanced'
  description: string
  defaultProps: Record<string, any>
  requiredProps: string[]
  examples: ComponentExample[]
}

export interface ComponentExample {
  scenario: string
  config: Record<string, any>
}

// ==================== AI 操作类型 ====================

export type AIActionType =
  | 'add_component'
  | 'update_component'
  | 'delete_component'
  | 'reorder_components'
  | 'generate_title'
  | 'suggest_improvement'
  | 'follow_up'

export interface FollowUpOption {
  label: string
  value: string
}

export type FollowUpFieldType = 'chips' | 'single_choice' | 'multi_choice' | 'text'

export interface FollowUpField {
  id: string
  type: FollowUpFieldType
  label: string
  placeholder?: string
  options?: FollowUpOption[]
  required?: boolean
}

export interface FollowUpGuide {
  title?: string
  description?: string
  fields: FollowUpField[]
  submitLabel?: string
  dismissLabel?: string
}

export interface AIAction {
  /** 持久化 ID，与 toolCallId 或 nanoid 对应 */
  id?: string
  type: AIActionType
  data: any
  description?: string
  /** 是否已在画布应用 */
  applied?: boolean
  appliedAt?: number
}

// ==================== 对话会话 ====================

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  context?: AIContext
  createdAt: number
  updatedAt: number
}

// ==================== API 请求/响应 ====================

export interface SiliconFlowRequest {
  model: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  stream: boolean
  temperature?: number
  max_tokens?: number
}

export interface SiliconFlowResponse {
  id: string
  choices: Array<{
    delta: {
      content: string
    }
    finish_reason: string | null
  }>
}

// ==================== Hook 返回类型 ====================

export interface UseAIChatReturn {
  messages: Message[]
  isLoading: boolean
  streamingContent: string
  sendMessage: (content: string, attachedComponents?: AttachedComponentRef[]) => Promise<void>
  clearMessages: () => void
  stopStreaming: () => void
  chatSessionId: string | null
  isLoadingHistory: boolean
  isSwitchingSession: boolean
  loadLatestChat: () => Promise<void>
  createNewSession: () => Promise<string | null>
  updateChatTitle: (sessionId: string, title: string) => Promise<boolean>
  switchToSession: (sessionId: string) => Promise<boolean>
  setMessagesFromHistory: (messages: Message[], sessionId: string) => void
  markActionApplied: (messageId: string, actionId: string) => Promise<void>
  markFollowUpHandled: (messageId: string, actionId: string) => Promise<void>
}

export interface UseAIActionsReturn {
  executeAction: (action: AIAction) => Promise<boolean>
  previewAction: (action: AIAction) => ComponentData | null
  isExecuting: boolean
}

