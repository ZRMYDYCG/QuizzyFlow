/**
 * ChatMessage Component
 * 单条聊天消息
 */

import React from 'react'
import { Avatar, Button, Tag } from 'antd'
import { UserOutlined, RobotOutlined, CheckOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import { Message, AIAction } from '../types'
import { formatActionDescription } from '../services/responseParser'
import { Sparkles } from 'lucide-react'

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

  return (
    <div
      className={`mb-4 flex min-w-0 gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      data-message-id={message.id}
    >
      {/* 头像 */}
      <div className="shrink-0">
        {isUser ? (
          <Avatar icon={<UserOutlined />} className="bg-blue-500" />
        ) : (
          <Avatar icon={<RobotOutlined />} className="bg-purple-500" />
        )}
      </div>

      {/* 消息内容 */}
      <div className={`min-w-0 flex-1 ${isUser ? 'flex flex-col items-end' : ''}`}>
        {/* 消息气泡 */}
        <div
          className={`max-w-full rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
          }`}
        >
          {/* 流式输出指示器 */}
          {message.isStreaming && (
            <div className="flex items-center gap-2 mb-2 text-purple-500">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-xs">AI 正在思考...</span>
            </div>
          )}

          {/* 消息内容（Markdown 渲染） */}
          <div className="prose prose-sm max-w-none overflow-hidden break-words dark:prose-invert">
            {isUser ? (
              <p className="text-white mb-0">{message.content}</p>
            ) : !getDisplayContent(message.content) && message.actions?.length ? (
              <p className="text-gray-500 dark:text-gray-400 mb-0 text-sm">
                已生成 {message.actions.length} 项操作提案，请在下方确认应用。
              </p>
            ) : (
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    const isInline = !match
                    
                    if (isInline) {
                      return (
                        <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-sm" {...props}>
                          {children}
                        </code>
                      )
                    }
                    
                    // 代码块（不使用 SyntaxHighlighter 避免构建问题）
                    return (
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <code className={className}>
                          {String(children).replace(/\n$/, '')}
                        </code>
                      </pre>
                    )
                  },
                }}
              >
                {getDisplayContent(message.content)}
              </ReactMarkdown>
            )}
          </div>
        </div>

        {/* 操作按钮（如果有 actions） */}
        {isAssistant && message.actions && message.actions.length > 0 && (
          <div className="mt-2 w-full space-y-2">
            {message.actions.map((action) => {
              const isSuggestion = action.type === 'suggest_improvement'
              const isApplied = !!action.applied
              const actionKey = action.id ?? `${action.type}-${action.description}`

              return (
                <div
                  key={actionKey}
                  className={`w-full rounded-lg border p-2.5 ${
                    isApplied
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="mb-2">
                    <Tag
                      color={isApplied ? 'success' : 'blue'}
                      className="m-0 max-w-full whitespace-normal break-words text-left leading-relaxed"
                      style={{ height: 'auto', whiteSpace: 'normal' }}
                    >
                      {formatActionDescription(action)}
                    </Tag>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {isApplied ? (
                      <Tag color="success" className="m-0 shrink-0">
                        已应用
                      </Tag>
                    ) : isSuggestion ? (
                      <span className="text-xs text-gray-500">仅供参考</span>
                    ) : (
                      <Button
                        type="primary"
                        size="small"
                        icon={<CheckOutlined />}
                        loading={isExecuting && executingActionId === action.id}
                        disabled={!action.id}
                        onClick={() => onExecuteAction?.(action)}
                        className="shrink-0"
                      >
                        应用此操作
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
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

