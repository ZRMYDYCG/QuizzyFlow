/**
 * ChatWindow Component
 * 聊天窗口主组件
 */

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Empty, Button } from 'antd'
import { MessageSquare, ArrowDown } from 'lucide-react'
import { Message, AIAction } from '../types'
import ChatMessage from './ChatMessage'
import { cn } from '@/utils'

interface ChatWindowProps {
  messages: Message[]
  onExecuteAction?: (messageId: string, action: AIAction) => void
  isExecuting?: boolean
  executingActionId?: string | null
  emptyText?: string
}

const BOTTOM_THRESHOLD = 64

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onExecuteAction,
  isExecuting,
  executingActionId,
  emptyText = '开始与 AI 对话，我会帮助你创建和优化问卷',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const prevMessageCountRef = useRef(messages.length)

  const checkIfAtBottom = useCallback(() => {
    const el = scrollRef.current
    if (!el) return true
    return el.scrollHeight - el.scrollTop - el.clientHeight <= BOTTOM_THRESHOLD
  }, [])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
    isAtBottomRef.current = true
    setShowScrollButton(false)
  }, [])

  const handleScroll = useCallback(() => {
    const atBottom = checkIfAtBottom()
    isAtBottomRef.current = atBottom
    setShowScrollButton(!atBottom)
  }, [checkIfAtBottom])

  // 用户发送新消息时强制滚到底部
  useEffect(() => {
    const prevCount = prevMessageCountRef.current
    prevMessageCountRef.current = messages.length

    if (messages.length > prevCount) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.role === 'user') {
        requestAnimationFrame(() => scrollToBottom('smooth'))
      }
    }
  }, [messages, scrollToBottom])

  // 已在底部时，随内容更新自动触底（含流式输出）
  useEffect(() => {
    if (!isAtBottomRef.current || messages.length === 0) return
    requestAnimationFrame(() => scrollToBottom('auto'))
  }, [messages, scrollToBottom])

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[200px] items-center justify-center">
            <Empty
              image={<MessageSquare className="mx-auto h-16 w-16 text-gray-300" />}
              description={
                <div className="text-center">
                  <p className="mb-2 text-gray-500">{emptyText}</p>
                  <div className="text-xs text-gray-400">
                    <p>你可以问我：</p>
                    <ul className="mt-2 list-none space-y-1">
                      <li>💡 &quot;帮我添加一个姓名输入框&quot;</li>
                      <li>💡 &quot;创建一个满意度调查问卷&quot;</li>
                      <li>💡 &quot;这个问卷有什么可以改进的？&quot;</li>
                    </ul>
                  </div>
                </div>
              }
            />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onExecuteAction={
                  onExecuteAction
                    ? (action) => onExecuteAction(message.id, action)
                    : undefined
                }
                isExecuting={isExecuting}
                executingActionId={executingActionId}
              />
            ))}
          </div>
        )}
      </div>

      {showScrollButton && messages.length > 0 && (
        <Button
          type="primary"
          shape="circle"
          size="small"
          icon={<ArrowDown className="h-4 w-4" />}
          aria-label="回到底部"
          onClick={() => scrollToBottom('smooth')}
          className={cn(
            'absolute bottom-3 right-3 z-10 shadow-lg',
            'flex h-8 w-8 items-center justify-center'
          )}
        />
      )}
    </div>
  )
}

export default ChatWindow
