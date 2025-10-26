/**
 * ChatWindow Component
 * 聊天窗口主组件
 */

import React, { useRef, useEffect } from 'react'
import { Empty } from 'antd'
import { MessageSquare } from 'lucide-react'
import { Message, AIAction } from '../types'
import ChatMessage from './ChatMessage'

interface ChatWindowProps {
  messages: Message[]
  onExecuteAction?: (action: AIAction) => void
  isExecuting?: boolean
  emptyText?: string
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onExecuteAction,
  isExecuting,
  emptyText = '开始与 AI 对话，我会帮助你创建和优化问卷',
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <Empty
            image={<MessageSquare className="w-16 h-16 text-gray-300 mx-auto" />}
            description={
              <div className="text-center">
                <p className="text-gray-500 mb-2">{emptyText}</p>
                <div className="text-xs text-gray-400">
                  <p>你可以问我：</p>
                  <ul className="list-none mt-2 space-y-1">
                    <li>💡 "帮我添加一个姓名输入框"</li>
                    <li>💡 "创建一个满意度调查问卷"</li>
                    <li>💡 "这个问卷有什么可以改进的？"</li>
                  </ul>
                </div>
              </div>
            }
          />
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onExecuteAction={onExecuteAction}
              isExecuting={isExecuting}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}

export default ChatWindow

