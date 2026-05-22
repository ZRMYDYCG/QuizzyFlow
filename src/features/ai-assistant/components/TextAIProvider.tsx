/**
 * TextAIProvider — 包裹右侧属性面板，聚焦可编辑输入框时显示 AI 工具栏
 */

import React, { useCallback } from 'react'
import { useTextSelection } from '../hooks/useTextSelection'
import { useTextAI } from '../hooks/useTextAI'
import TextSelectionToolbar from './TextSelectionToolbar'
import type { TextAIApplyOptions } from '../services/textAI'

interface TextAIProviderProps {
  children: React.ReactNode
  enabled?: boolean
}

const TextAIProvider: React.FC<TextAIProviderProps> = ({ children, enabled = true }) => {
  const { selection, clearSelection } = useTextSelection({
    containerSelector: '[data-text-ai-panel]',
    delay: 60,
  })

  const { processAndUpdate } = useTextAI()

  const handleApply = useCallback(
    async (
      action: string,
      text: string,
      applyOptions?: TextAIApplyOptions,
    ): Promise<boolean> => {
      if (!selection?.inputElement) {
        return false
      }

      const newText = await processAndUpdate(
        action as Parameters<typeof processAndUpdate>[0],
        text,
        selection.inputElement,
        {
          isPartialSelection: selection.isPartialSelection,
          ...applyOptions,
        },
      )

      if (newText) {
        selection.inputElement.focus()
        return true
      }

      return false
    },
    [selection, processAndUpdate],
  )

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <>
      <div data-text-ai-panel className="flex flex-col h-full min-h-0">
        {children}
      </div>

      {selection && (
        <TextSelectionToolbar
          selection={selection}
          onApply={handleApply}
          onClose={clearSelection}
        />
      )}
    </>
  )
}

export default TextAIProvider
