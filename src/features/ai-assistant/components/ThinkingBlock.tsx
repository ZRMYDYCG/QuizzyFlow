/**
 * 思考过程展示块（AG-UI reasoning part）
 */
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Brain, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/utils'

interface ThinkingBlockProps {
  content?: string
  isStreaming?: boolean
}

const ThinkingBlock: React.FC<ThinkingBlockProps> = ({ content, isStreaming }) => {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (isStreaming) {
      setOpen(true)
    }
  }, [isStreaming])

  if (!content?.trim() && !isStreaming) {
    return null
  }

  // 无思考内容且非流式时不展示空块
  if (!content?.trim() && isStreaming) {
    return (
      <div className="mb-2 flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
        <Brain className="h-3.5 w-3.5 animate-pulse" />
        <span>正在思考...</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'mb-2 overflow-hidden rounded-lg border',
        'border-purple-200/70 bg-purple-50/60',
        'dark:border-purple-800/50 dark:bg-purple-950/30'
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center gap-2 px-3 py-2 text-left text-xs',
          'text-purple-700 dark:text-purple-300'
        )}
      >
        <Brain className={cn('h-3.5 w-3.5 shrink-0', isStreaming && 'animate-pulse')} />
        <span className="flex-1">{isStreaming ? '正在思考...' : '思考过程'}</span>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
        )}
      </button>

      {open && (
        <div
          className={cn(
            'border-t px-3 py-2 text-xs leading-relaxed',
            'border-purple-200/50 text-purple-900/75',
            'dark:border-purple-800/40 dark:text-purple-100/70',
            'prose prose-xs max-w-none dark:prose-invert'
          )}
        >
          <ReactMarkdown>{content?.trim() || '...'}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default ThinkingBlock
