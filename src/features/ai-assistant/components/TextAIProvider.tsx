/**
 * TextAIProvider Component
 * 文本 AI 功能提供者（包裹属性面板，启用文本选中 AI 功能）
 */

import React, { useCallback } from 'react'
import { useTextSelection } from '../hooks/useTextSelection'
import { useTextAI } from '../hooks/useTextAI'
import TextSelectionToolbar from './TextSelectionToolbar'

interface TextAIProviderProps {
  children: React.ReactNode
  enabled?: boolean
}

const TextAIProvider: React.FC<TextAIProviderProps> = ({ children, enabled = true }) => {
  // 监听文本选中（不限制容器，让它在整个右侧面板生效）
  const { selection, clearSelection, replaceSelection } = useTextSelection({
    minLength: 1, // 至少选中 1 个字符
    containerSelector: undefined, // 不限制容器
    delay: 100,
  })

  // 文本 AI 处理（更新 Redux）
  const { processAndUpdate } = useTextAI()

  // 替换文本并更新 Redux
  const handleReplaceWithRedux = useCallback(
    async (action: string, selectedText: string): Promise<boolean> => {
      if (!selection?.inputElement) {
        console.error('未找到输入框元素')
        return false
      }

      // 调用 AI 并更新 Redux
      const newText = await processAndUpdate(
        action as any,
        selectedText,
        selection.inputElement
      )

      if (newText) {
        // 同时更新输入框显示
        replaceSelection(newText)
        return true
      }

      return false
    },
    [selection, processAndUpdate, replaceSelection]
  )

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <>
      {/* 直接渲染 children，不额外包装 */}
      {children}

      {/* 浮动工具栏 */}
      {selection && (
        <TextSelectionToolbar
          selection={selection}
          onReplaceWithRedux={handleReplaceWithRedux}
          onClose={clearSelection}
        />
      )}
    </>
  )
}

export default TextAIProvider

