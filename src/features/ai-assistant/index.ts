/**
 * AI Assistant Feature
 * 统一导出
 */

// Components
export { default as AIDrawer } from './components/AIDrawer'
export { default as ChatWindow } from './components/ChatWindow'
export { default as ChatMessage } from './components/ChatMessage'
export { default as ChatInput } from './components/ChatInput'
export { default as ContextIndicator } from './components/ContextIndicator'
export { default as QuickActions } from './components/QuickActions'
export { default as ChatHistory } from './components/ChatHistory'
export { default as TextSelectionToolbar } from './components/TextSelectionToolbar'
export { default as TextAIProvider } from './components/TextAIProvider'

// Hooks
export { useAIChat } from './hooks/useAIChat'
export { useAIActions } from './hooks/useAIActions'
export { useAIContext } from './hooks/useAIContext'
export { useAIChatSession } from './hooks/useAIChatSession'
export { useTextSelection } from './hooks/useTextSelection'
export { useTextAI } from './hooks/useTextAI'

// Services
export * from './services/siliconflow'
export * from './services/promptBuilder'
export * from './services/responseParser'
export * from './services/actionExecutor'

// Utils
export * from './utils/templateSchema'

// Types
export * from './types'

