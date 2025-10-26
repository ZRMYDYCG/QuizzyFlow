/**
 * AI Assistant Types
 * AI 助手相关的类型定义
 */

// ==================== 消息类型 ====================

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  actions?: AIAction[]
  isStreaming?: boolean
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

export interface AIAction {
  type: AIActionType
  data: any
  description?: string
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
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  stopStreaming: () => void
  chatSessionId: string | null
  isLoadingHistory: boolean
  loadLatestChat: () => Promise<void>
  createNewSession: () => Promise<string | null>
  setMessagesFromHistory: (messages: Message[], sessionId: string) => void
}

export interface UseAIActionsReturn {
  executeAction: (action: AIAction) => Promise<boolean>
  previewAction: (action: AIAction) => ComponentData | null
  isExecuting: boolean
}

