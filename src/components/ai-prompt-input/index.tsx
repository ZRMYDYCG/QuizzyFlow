import { useRef, useState, type FC, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { Loader2, Send, Sparkles, Square } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import UserChatAvatar from '@/components/user-chat-avatar'
import { cn } from '@/utils'

export interface AIPromptInputProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onSend: (message: string) => void
  onStop?: () => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
  rows?: number
  maxHeight?: number
  className?: string
  variant?: 'chat' | 'promo'
  showAvatar?: boolean
  submitLabel?: string
  loadingLabel?: string
  footerHint?: ReactNode
  quickPrompts?: string[]
}

const AIPromptInput: FC<AIPromptInputProps> = ({
  value: controlledValue,
  defaultValue = '',
  onChange,
  onSend,
  onStop,
  isLoading = false,
  disabled = false,
  placeholder = '输入消息...',
  rows = 3,
  maxHeight = 160,
  className,
  variant = 'chat',
  showAvatar = true,
  submitLabel = '开始创作',
  loadingLabel = '创建中...',
  footerHint,
  quickPrompts,
}) => {
  const { theme, primaryColor, themeColors } = useTheme()
  const [internalValue, setInternalValue] = useState(defaultValue)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const setValue = (next: string) => {
    if (!isControlled) {
      setInternalValue(next)
    }
    onChange?.(next)
  }

  const resetHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'
    }
  }

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading || disabled) return
    onSend(trimmed)
    setValue('')
    resetHeight()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSend()
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
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
  }

  const handleQuickPrompt = (prompt: string) => {
    setValue(prompt)
    textAreaRef.current?.focus()
  }

  const isPromo = variant === 'promo'
  const inputDisabled = isLoading || disabled

  const textarea = (
    <textarea
      ref={textAreaRef}
      value={value}
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={inputDisabled}
      rows={rows}
      className={cn(
        'w-full resize-none border-0 bg-transparent outline-none leading-relaxed',
        isPromo ? 'px-0 py-0 text-base' : 'min-h-[4.5rem] px-0 py-0 text-sm',
        'placeholder:text-gray-400',
        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
      )}
    />
  )

  const chatFooter = (
    <div className={cn('flex items-center', showAvatar ? 'justify-between' : 'justify-end')}>
      {showAvatar && <UserChatAvatar size={28} />}
      {isLoading ? (
        onStop ? (
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
            disabled
            aria-label="发送中"
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg opacity-50',
              theme === 'dark'
                ? 'bg-white text-gray-900'
                : 'bg-gray-900 text-white'
            )}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </button>
        )
      ) : (
        <button
          type="button"
          onClick={handleSend}
          disabled={!value.trim() || disabled}
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
  )

  const promoFooter = (
    <div className="mt-3 flex items-center justify-between gap-3">
      {footerHint ?? (
        <div className="flex items-center gap-1.5 text-xs text-purple-500">
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI 智能生成</span>
        </div>
      )}
      <button
        type="submit"
        disabled={!value.trim() || inputDisabled}
        className="flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`,
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {isLoading ? loadingLabel : submitLabel}
      </button>
    </div>
  )

  const inputBox = (
    <div
      className={cn(
        'transition-colors',
        isPromo
          ? cn(
              'rounded-2xl border p-4 shadow-lg focus-within:shadow-xl',
              theme === 'dark' ? 'border-slate-700 bg-slate-900/80' : 'border-gray-200 bg-white'
            )
          : cn(
              'flex flex-col gap-2 rounded-xl border p-3',
              theme === 'dark' ? 'border-white/10 bg-[#2a2a2f]' : 'border-gray-200 bg-white'
            ),
        className
      )}
    >
      {textarea}
      {isPromo ? promoFooter : chatFooter}
    </div>
  )

  return (
    <div>
      {isPromo ? (
        <form onSubmit={handleSubmit}>{inputBox}</form>
      ) : (
        inputBox
      )}

      {quickPrompts && quickPrompts.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {quickPrompts.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleQuickPrompt(item)}
              disabled={inputDisabled}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50',
                theme === 'dark'
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default AIPromptInput
