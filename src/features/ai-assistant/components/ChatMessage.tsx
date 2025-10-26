/**
 * ChatMessage Component
 * 单条聊天消息
 */

import React from 'react'
import { Avatar, Button, Space, Tag } from 'antd'
import { UserOutlined, RobotOutlined, CheckOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import { Message, AIAction } from '../types'
import { formatActionDescription } from '../services/responseParser'
import { Sparkles } from 'lucide-react'

interface ChatMessageProps {
  message: Message
  onExecuteAction?: (action: AIAction) => void
  isExecuting?: boolean
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onExecuteAction, isExecuting }) => {
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
      className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      data-message-id={message.id}
    >
      {/* 头像 */}
      <div className="flex-shrink-0">
        {isUser ? (
          <Avatar icon={<UserOutlined />} className="bg-blue-500" />
        ) : (
          <Avatar icon={<RobotOutlined />} className="bg-purple-500" />
        )}
      </div>

      {/* 消息内容 */}
      <div className={`flex-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* 消息气泡 */}
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
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
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {isUser ? (
              <p className="text-white mb-0">{message.content}</p>
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
          <div className="mt-2 space-y-2">
            {message.actions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <Tag color="blue" className="m-0">
                  {formatActionDescription(action)}
                </Tag>
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  loading={isExecuting}
                  onClick={() => onExecuteAction?.(action)}
                >
                  应用此操作
                </Button>
              </div>
            ))}
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

