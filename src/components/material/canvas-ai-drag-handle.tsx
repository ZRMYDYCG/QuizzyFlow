/**
 * 画布问卷项拖入 AI 对话的拖拽手柄（悬停显示，原生 HTML5 拖拽）
 */

import React, { useCallback } from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { QuestionComponentType } from '@/store/modules/question-component'
import {
  QUESTION_COMPONENT_DRAG_MIME,
  notifyQuestionComponentDragEnd,
  notifyQuestionComponentDragStart,
} from '@/features/ai-assistant/constants/drag'
import { compactComponentForAI } from '@/features/ai-assistant/utils/component-compact'

interface CanvasAiDragHandleProps {
  component: QuestionComponentType
  disabled?: boolean
}

const CanvasAiDragHandle: React.FC<CanvasAiDragHandleProps> = ({
  component,
  disabled = false,
}) => {
  const { theme } = useTheme()

  const stopBubble = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation()
  }, [])

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    e.stopPropagation()

    const payload = compactComponentForAI(component)
    const json = JSON.stringify(payload)
    e.dataTransfer.setData(QUESTION_COMPONENT_DRAG_MIME, json)
    e.dataTransfer.setData('text/plain', json)
    e.dataTransfer.effectAllowed = 'copy'

    notifyQuestionComponentDragStart()
  }

  const handleDragEnd = () => {
    notifyQuestionComponentDragEnd()
  }

  return (
    <div
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerDown={stopBubble}
      onMouseDown={stopBubble}
      onTouchStart={stopBubble}
      onClick={stopBubble}
      className={cn(
        'absolute left-2 top-2 z-20 flex h-6 w-6 cursor-grab items-center justify-center rounded-md',
        'opacity-0 transition-all duration-200 group-hover:opacity-100',
        'active:cursor-grabbing',
        theme === 'dark'
          ? 'bg-[#2a2a2f]/95 text-slate-400 ring-1 ring-white/10 hover:text-violet-300 hover:ring-violet-400/35'
          : 'bg-white/95 text-gray-400 shadow-sm ring-1 ring-gray-200/90 hover:text-violet-600 hover:ring-violet-300/80',
        disabled && 'cursor-not-allowed opacity-0',
      )}
      title="拖到 AI 对话引用此题"
    >
      <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
    </div>
  )
}

export default CanvasAiDragHandle
