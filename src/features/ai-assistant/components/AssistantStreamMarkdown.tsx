/**
 * AI 回复 Markdown 渲染（Streamdown：流式 + 打字机动画）
 */
import React from 'react'
import { Streamdown } from 'streamdown'
import { code } from '@streamdown/code'
import { cn } from '@/utils'

interface AssistantStreamMarkdownProps {
  content: string
  isStreaming?: boolean
  className?: string
}

const AssistantStreamMarkdown: React.FC<AssistantStreamMarkdownProps> = ({
  content,
  isStreaming = false,
  className,
}) => {
  if (!content.trim()) return null

  return (
    <Streamdown
      className={cn(
        'assistant-stream-markdown max-w-none',
        'text-[11px] leading-snug text-gray-600 dark:text-gray-300',
        '!space-y-1.5',
        className,
      )}
      mode={isStreaming ? 'streaming' : 'static'}
      parseIncompleteMarkdown={isStreaming}
      animated={
        isStreaming
          ? {
              animation: 'fadeIn',
              sep: 'word',
              duration: 80,
              stagger: 12,
            }
          : false
      }
      isAnimating={isStreaming}
      caret={isStreaming ? 'block' : undefined}
      plugins={{ code }}
      shikiTheme={['github-light', 'github-dark']}
      lineNumbers={false}
      controls={{ code: true }}
    >
      {content}
    </Streamdown>
  )
}

export default AssistantStreamMarkdown
