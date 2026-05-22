/**
 * ChatInput Component
 * 聊天输入框
 */

import React, { useState, useRef, KeyboardEvent } from 'react'
import { Send, Square } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  onStop?: () => void
  isLoading?: boolean
  placeholder?: string
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onStop,
  isLoading = false,
  placeholder = '输入消息...',
}) => {
  const { theme } = useTheme()
  const [value, setValue] = useState('')
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (trimmed && !isLoading) {
      onSend(trimmed)
      setValue('')
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div
      className={cn(
        'relative rounded-xl border p-3 transition-colors',
        theme === 'dark'
          ? 'border-white/10 bg-[#2a2a2f]'
          : 'border-gray-200 bg-white'
      )}
    >
      <textarea
        ref={textAreaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        rows={3}
        className={cn(
          'block w-full resize-none border-0 bg-transparent pb-10 text-sm outline-none',
          'placeholder:text-gray-400',
          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        )}
      />

      <div className="absolute bottom-3 right-3">
        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="停止生成"
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg transition-opacity',
              theme === 'dark' ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-900 hover:bg-gray-800'
            )}
          >
            <Square className="h-3.5 w-3.5 fill-white text-white" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            disabled={!value.trim()}
            aria-label="发送消息"
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg transition-all',
              'disabled:cursor-not-allowed disabled:opacity-30',
              theme === 'dark'
                ? 'bg-white text-gray-900 hover:bg-gray-100'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ChatInput
