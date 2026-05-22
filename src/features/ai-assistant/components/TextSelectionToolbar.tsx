/**
 * 输入框聚焦时显示的文本 AI 工具栏（简约样式）
 */

import React, { useState, useEffect, useRef } from 'react'
import { Spin, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { TextSelection } from '../hooks/useTextSelection'
import {
  TextAIAction,
  TextAIApplyOptions,
  getActionLabel,
  TRANSLATE_LANGUAGE_OPTIONS,
  type TranslateTargetLanguage,
} from '../services/textAI'

interface TextSelectionToolbarProps {
  selection: TextSelection | null
  onApply: (
    action: string,
    text: string,
    options?: TextAIApplyOptions,
  ) => Promise<boolean>
  onClose: () => void
}

const MAIN_ACTIONS: TextAIAction[] = [
  'continue',
  'polish',
  'translate',
  'rewrite',
  'simplify',
  'expand',
]

const TextSelectionToolbar: React.FC<TextSelectionToolbarProps> = ({
  selection,
  onApply,
  onClose,
}) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null,
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [showTranslateMenu, setShowTranslateMenu] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setShowTranslateMenu(false)
  }, [selection?.inputElement])

  useEffect(() => {
    if (!selection?.rect) {
      setPosition(null)
      return
    }

    const rect = selection.rect
    const toolbarWidth = 320
    const toolbarHeight = showTranslateMenu ? 68 : 36
    const gap = 6

    let top = rect.bottom + window.scrollY + gap
    let left = rect.left + window.scrollX

    if (top + toolbarHeight > window.innerHeight + window.scrollY - 8) {
      top = rect.top + window.scrollY - toolbarHeight - gap
    }

    const maxLeft = window.innerWidth - toolbarWidth - 12
    if (left > maxLeft) left = maxLeft
    if (left < 12) left = 12

    setPosition({ top, left })
  }, [selection, showTranslateMenu])

  const runAction = async (
    action: TextAIAction,
    applyOptions?: TextAIApplyOptions,
  ) => {
    if (!selection?.inputElement) return

    setIsProcessing(true)
    setShowTranslateMenu(false)
    try {
      const success = await onApply(action, selection.text, applyOptions)
      if (success) {
        message.success('已完成')
      }
    } catch (error) {
      console.error('AI 处理失败:', error)
      message.error('处理失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMainAction = (action: TextAIAction) => {
    if (action === 'translate') {
      setShowTranslateMenu((open) => !open)
      return
    }
    setShowTranslateMenu(false)
    runAction(action)
  }

  const handleTranslateTo = (lang: TranslateTargetLanguage) => {
    runAction('translate', { targetLanguage: lang })
  }

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node)
      ) {
        const target = e.target as HTMLElement
        if (!target.closest('input, textarea')) {
          onClose()
        }
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [onClose])

  if (!selection || !position) {
    return null
  }

  return (
    <div
      ref={toolbarRef}
      data-text-ai-toolbar
      className="fixed z-[9999] rounded-md border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
      style={{ top: position.top, left: position.left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="flex items-center gap-0.5 px-1 py-0.5">
        {isProcessing ? (
          <span className="flex items-center gap-2 px-2 py-1 text-xs text-gray-500">
            <Spin indicator={<LoadingOutlined spin style={{ fontSize: 12 }} />} />
            处理中
          </span>
        ) : (
          MAIN_ACTIONS.map((action, index) => (
            <React.Fragment key={action}>
              {index > 0 && (
                <span className="mx-0.5 h-3 w-px bg-gray-200 dark:bg-zinc-700" />
              )}
              <button
                type="button"
                className={`rounded px-2 py-1 text-xs transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800 ${
                  action === 'translate' && showTranslateMenu
                    ? 'bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-zinc-100'
                    : 'text-gray-600 dark:text-zinc-400'
                }`}
                disabled={isProcessing}
                onClick={() => handleMainAction(action)}
              >
                {getActionLabel(action)}
              </button>
            </React.Fragment>
          ))
        )}
      </div>

      {showTranslateMenu && !isProcessing && (
        <div className="border-t border-gray-100 px-2 py-1.5 dark:border-zinc-800">
          <span className="mb-1 block text-[11px] text-gray-400">翻译为</span>
          <div className="flex flex-wrap gap-1">
            {TRANSLATE_LANGUAGE_OPTIONS.map((item) => (
              <button
                key={item.value}
                type="button"
                className="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                onClick={() => handleTranslateTo(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TextSelectionToolbar
