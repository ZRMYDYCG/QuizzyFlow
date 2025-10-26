/**
 * TextSelectionToolbar Component
 * 文本选中工具栏（类似 Cursor 编辑器）
 */

import React, { useState, useEffect, useRef } from 'react'
import { Button, Space, Spin, Tooltip, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Sparkles, Languages, RefreshCw, Scissors, Maximize2, Type } from 'lucide-react'
import { TextSelection } from '../hooks/useTextSelection'
import { processTextWithAI, TextAIAction } from '../services/textAI'

interface TextSelectionToolbarProps {
  selection: TextSelection | null
  onReplaceWithRedux: (action: string, selectedText: string) => Promise<boolean>
  onClose: () => void
}

const TextSelectionToolbar: React.FC<TextSelectionToolbarProps> = ({
  selection,
  onReplaceWithRedux,
  onClose,
}) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentAction, setCurrentAction] = useState<TextAIAction | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  // 计算工具栏位置（优化：紧贴选中文字）
  useEffect(() => {
    if (!selection?.rect) {
      setPosition(null)
      return
    }

    const selectionRect = selection.rect
    const toolbarHeight = 50 // 工具栏高度
    const toolbarWidth = 400 // 工具栏宽度
    const offset = 8 // 与选中文字的间距

    // 默认显示在选中文字上方，居中对齐
    let top = selectionRect.top + window.scrollY - toolbarHeight - offset
    let left = selectionRect.left + window.scrollX + (selectionRect.width - toolbarWidth) / 2

    // 如果上方空间不足（距离顶部小于工具栏高度+边距），显示在下方
    if (selectionRect.top < toolbarHeight + offset + 20) {
      top = selectionRect.bottom + window.scrollY + offset
    }

    // 左边界检查
    if (left < 10) {
      left = 10
    }

    // 右边界检查
    const maxLeft = window.innerWidth - toolbarWidth - 10
    if (left > maxLeft) {
      left = maxLeft
    }

    console.log('📍 工具栏位置计算:', {
      selectionRect: {
        top: selectionRect.top,
        left: selectionRect.left,
        width: selectionRect.width,
      },
      toolbar: { top, left },
    })

    setPosition({ top, left })
  }, [selection])

  // 处理 AI 操作
  const handleAction = async (action: TextAIAction) => {
    if (!selection?.text) return

    setIsProcessing(true)
    setCurrentAction(action)

    try {
      // 清除选中状态
      window.getSelection()?.removeAllRanges()
      
      // 调用替换方法（会同时更新 Redux 和输入框）
      const success = await onReplaceWithRedux(action, selection.text)
      
      if (success) {
        message.success('✨ 处理完成')
      }
    } catch (error) {
      console.error('AI 处理失败:', error)
      message.error('AI 处理失败，请重试')
    } finally {
      setIsProcessing(false)
      setCurrentAction(null)
    }
  }

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  if (!selection || !position) {
    return null
  }

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[99999] bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl border border-purple-300 dark:border-purple-600 p-2"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        animation: 'fadeInScale 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-5px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>

      {/* 小箭头指向选中文字 */}
      <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-b border-r border-purple-300 dark:border-purple-600 rotate-45"></div>

      {/* 加载状态 */}
      {isProcessing ? (
        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg">
          <Spin indicator={<LoadingOutlined spin className="text-purple-500" />} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI 处理中...</span>
        </div>
      ) : (
        <div className="space-y-1.5">
          {/* 第一行：主要操作 */}
          <Space size={4} wrap>
            <Tooltip title="基于上下文继续写">
              <Button
                size="small"
                type="primary"
                icon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={() => handleAction('continue')}
                className="flex items-center gap-1"
              >
                续写
              </Button>
            </Tooltip>

            <Tooltip title="优化表达，更专业">
              <Button
                size="small"
                type="primary"
                icon={<Type className="w-3.5 h-3.5" />}
                onClick={() => handleAction('polish')}
                className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-blue-500"
              >
                润色
              </Button>
            </Tooltip>

            <Tooltip title="中英互译">
              <Button
                size="small"
                icon={<Languages className="w-3.5 h-3.5" />}
                onClick={() => handleAction('translate')}
                className="flex items-center gap-1"
              >
                翻译
              </Button>
            </Tooltip>
          </Space>

          {/* 第二行：辅助操作 */}
          <Space size={4} wrap>
            <Tooltip title="换一种说法">
              <Button
                size="small"
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                onClick={() => handleAction('rewrite')}
              >
                改写
              </Button>
            </Tooltip>

            <Tooltip title="让文字更简洁">
              <Button
                size="small"
                icon={<Scissors className="w-3.5 h-3.5" />}
                onClick={() => handleAction('simplify')}
              >
                精简
              </Button>
            </Tooltip>

            <Tooltip title="让文字更详细">
              <Button
                size="small"
                icon={<Maximize2 className="w-3.5 h-3.5" />}
                onClick={() => handleAction('expand')}
              >
                扩写
              </Button>
            </Tooltip>
          </Space>
        </div>
      )}
    </div>
  )
}

export default TextSelectionToolbar

