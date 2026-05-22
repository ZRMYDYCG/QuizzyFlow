/**
 * AI 助手固定侧边栏（编辑器右侧）
 */
import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils'
import AIChatPanel from './AIChatPanel'

interface AISidePanelProps {
  questionId?: string
  width: number
  initialMessage?: string
  onInitialMessageSent?: () => void
}

const AISidePanel: React.FC<AISidePanelProps> = ({
  questionId,
  width,
  initialMessage,
  onInitialMessageSent,
}) => {
  const { theme } = useTheme()

  return (
    <aside
      className={cn(
        'relative flex h-full shrink-0 flex-col border-l',
        theme === 'dark' ? 'border-white/5 bg-[#1e1e23]' : 'border-gray-200 bg-white'
      )}
      style={{ width }}
    >
      <AIChatPanel
        questionId={questionId}
        initialMessage={initialMessage}
        onInitialMessageSent={onInitialMessageSent}
        className="h-full"
      />
    </aside>
  )
}

export default AISidePanel
