/**
 * ChatMessage Component
 * 单条聊天消息
 */

import React from 'react'
import { Message, AIAction } from '../types'
import { resolveAssistantDisplayContent } from '../utils/follow-up'
import ThinkingBlock from './ThinkingBlock'
import ToolCallsBlock from './ToolCallsBlock'
import ActionProposalPanel from './ActionProposalPanel'
import UserChatAvatar from './UserChatAvatar'
import AssistantStreamMarkdown from './AssistantStreamMarkdown'

interface ChatMessageProps {
  message: Message
  onExecuteAction?: (action: AIAction) => void
  isExecuting?: boolean
  executingActionId?: string | null
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onExecuteAction,
  isExecuting,
  executingActionId,
}) => {
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 移除 action 代码块；引导追问段落会从正文中剥离到 FollowUpGuideForm
  const displayContent = resolveAssistantDisplayContent(message)

  return (
    <div
      className={`mb-4 flex min-w-0 ${isUser ? 'flex-row-reverse gap-3' : ''}`}
      data-message-id={message.id}
    >
      {isUser && (
        <div className="shrink-0">
          <UserChatAvatar size={32} />
        </div>
      )}

      {/* 消息内容 */}
      <div className={`min-w-0 flex-1 overflow-hidden ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div
          className={
            isUser
              ? 'max-w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-800 dark:bg-[#3a3a42] dark:text-gray-100'
              : 'max-w-full'
          }
        >
          {/* 思考过程（AG-UI reasoning） */}
          {isAssistant && (message.reasoning || message.isReasoningStreaming) && (
            <ThinkingBlock
              content={message.reasoning}
              isStreaming={message.isReasoningStreaming}
            />
          )}

          {/* Tool Call 调用详情（AG-UI tool parts） */}
          {isAssistant && message.toolCalls && message.toolCalls.length > 0 && (
            <ToolCallsBlock
              toolCalls={message.toolCalls}
              isStreaming={message.isStreaming}
            />
          )}

          {/* AI 正文：Streamdown 流式 Markdown + 打字机动画 */}
          <div
            className={
              isUser
                ? 'overflow-hidden break-words'
                : 'max-w-none overflow-hidden break-words'
            }
          >
            {isUser ? (
              <p className="mb-0 text-sm">{message.content}</p>
            ) : !displayContent && message.actions?.length ? (
              <p className="mb-0 text-xs text-gray-500 dark:text-gray-400">
                已生成 {message.actions.length} 项操作提案，请在下方确认应用。
              </p>
            ) : (
              <AssistantStreamMarkdown
                content={displayContent}
                isStreaming={!!message.isStreaming && !message.isReasoningStreaming}
              />
            )}
          </div>
        </div>

        {/* 操作提案：折叠 + 表单预览 */}
        {isAssistant && message.actions && message.actions.filter((a) => a.type !== 'follow_up').length > 0 && (
          <ActionProposalPanel
            actions={message.actions.filter((a) => a.type !== 'follow_up')}
            onExecuteAction={onExecuteAction}
            isExecuting={isExecuting}
            executingActionId={executingActionId}
          />
        )}

        {/* 时间戳 */}
        <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage

