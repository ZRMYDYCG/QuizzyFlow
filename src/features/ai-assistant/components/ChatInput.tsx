/**
 * ChatInput Component
 * 聊天输入框
 */

import React, { useState, useRef, KeyboardEvent } from 'react'
import { Button, Input } from 'antd'
import { SendOutlined, StopOutlined } from '@ant-design/icons'
import { Sparkles } from 'lucide-react'

const { TextArea } = Input

interface ChatInputProps {
  onSend: (message: string) => void
  onStop?: () => void
  isLoading?: boolean
  placeholder?: string
  quickActions?: Array<{
    label: string
    prompt: string
  }>
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onStop,
  isLoading = false,
  placeholder = '输入您的问题，按 Enter 发送，Shift+Enter 换行...',
  quickActions,
}) => {
  const [value, setValue] = useState('')
  const textAreaRef = useRef<any>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (trimmed && !isLoading) {
      onSend(trimmed)
      setValue('')
      // 重置高度
      if (textAreaRef.current) {
        textAreaRef.current.resizableTextArea?.textArea?.style.setProperty('height', 'auto')
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 发送，Shift+Enter 换行
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickAction = (prompt: string) => {
    if (!isLoading) {
      setValue(prompt)
      // 自动聚焦到输入框
      textAreaRef.current?.focus()
    }
  }

  return (
    <div className="space-y-2">
      {/* 快捷操作按钮 */}
      {quickActions && quickActions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              size="small"
              icon={<Sparkles className="w-3 h-3" />}
              onClick={() => handleQuickAction(action.prompt)}
              disabled={isLoading}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* 输入框和发送按钮 */}
      <div className="flex gap-2">
        <TextArea
          ref={textAreaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoSize={{ minRows: 1, maxRows: 6 }}
          disabled={isLoading}
          className="flex-1"
        />
        {isLoading ? (
          <Button
            type="primary"
            danger
            icon={<StopOutlined />}
            onClick={onStop}
            className="self-end"
          >
            停止
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!value.trim()}
            className="self-end"
          >
            发送
          </Button>
        )}
      </div>

      {/* 提示文字 */}
      <div className="text-xs text-gray-400 text-center">
        AI 助手基于大语言模型，回答仅供参考
      </div>
    </div>
  )
}

export default ChatInput

