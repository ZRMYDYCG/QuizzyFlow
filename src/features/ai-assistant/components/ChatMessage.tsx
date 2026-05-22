/**
 * ChatMessage Component
 * 单条聊天消息
 */

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Message, AIAction } from '../types'
import { Sparkles } from 'lucide-react'
import ThinkingBlock from './ThinkingBlock'
import ToolCallsBlock from './ToolCallsBlock'
import ActionProposalPanel from './ActionProposalPanel'
import UserChatAvatar from './UserChatAvatar'

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

  // 移除 action 代码块的内容（用于显示）
  const getDisplayContent = (content: string) => {
    return content.replace(/```action\s*[\s\S]*?```/g, '').trim()
  }

  const markdownComponents = {
    p: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-2 last:mb-0">{children}</p>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-2 list-disc pl-4 last:mb-0">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-2 list-decimal pl-4 last:mb-0">{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
      <li className="mb-0.5">{children}</li>
    ),
    code({ className, children, ...props }: React.ComponentProps<'code'> & { className?: string }) {
      const match = /language-(\w+)/.exec(className || '')
      const isInline = !match

      if (isInline) {
        return (
          <code
            className="rounded bg-black/[0.06] px-1 py-0.5 text-[11px] dark:bg-white/10"
            {...props}
          >
            {children}
          </code>
        )
      }

      return (
        <pre className="my-2 overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11px] text-gray-100">
          <code className={className} {...props}>
            {String(children).replace(/\n$/, '')}
          </code>
        </pre>
      )
    },
  }

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

          {/* 正文流式指示 */}
          {message.isStreaming && !message.isReasoningStreaming && (
            <div className="mb-2 flex items-center gap-2 text-purple-500">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span className="text-xs">AI 正在回复...</span>
            </div>
          )}

          {/* AI 正文：react-markdown + Tailwind typography */}
          <div
            className={
              isUser
                ? 'overflow-hidden break-words'
                : 'prose prose-xs max-w-none overflow-hidden break-words text-xs leading-relaxed text-gray-600 dark:prose-invert dark:text-gray-400'
            }
          >
            {isUser ? (
              <p className="mb-0 text-sm">{message.content}</p>
            ) : !getDisplayContent(message.content) && message.actions?.length ? (
              <p className="mb-0 text-xs text-gray-500 dark:text-gray-400">
                已生成 {message.actions.length} 项操作提案，请在下方确认应用。
              </p>
            ) : (
              <ReactMarkdown components={markdownComponents}>
                {getDisplayContent(message.content)}
              </ReactMarkdown>
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

