/**
 * useTextSelection Hook
 * 监听文本选中事件
 */

import { useState, useEffect, useCallback, useRef } from 'react'

export interface TextSelection {
  text: string
  range: Range | null
  rect: DOMRect | null
  element: HTMLElement | null
  inputElement: HTMLInputElement | HTMLTextAreaElement | null
  selectionStart: number
  selectionEnd: number
}

export interface UseTextSelectionOptions {
  /**
   * 选中文字的最小长度（默认 1）
   */
  minLength?: number
  
  /**
   * 目标容器选择器（只监听特定容器内的选中）
   */
  containerSelector?: string
  
  /**
   * 延迟显示工具栏的时间（ms，默认 100）
   */
  delay?: number
}

export const useTextSelection = (options: UseTextSelectionOptions = {}) => {
  const { minLength = 1, containerSelector, delay = 100 } = options

  const [selection, setSelection] = useState<TextSelection | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  /**
   * 处理选中事件
   */
  const handleSelectionChange = useCallback(() => {
    // 清除之前的延迟
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      const windowSelection = window.getSelection()

      if (!windowSelection || windowSelection.rangeCount === 0) {
        setSelection(null)
        return
      }

      const selectedText = windowSelection.toString().trim()

      // 检查选中文字长度
      if (!selectedText || selectedText.length < minLength) {
        setSelection(null)
        return
      }

      // 检查是否在目标容器内
      if (containerSelector) {
        const container = document.querySelector(containerSelector)
        if (!container) {
          setSelection(null)
          return
        }

        const range = windowSelection.getRangeAt(0)
        const isInsideContainer = container.contains(range.commonAncestorContainer)

        if (!isInsideContainer) {
          setSelection(null)
          return
        }
      }

      // 获取选中范围和位置
      const range = windowSelection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      const element = range.commonAncestorContainer.parentElement

      // 查找输入框元素
      let inputElement: HTMLElement | null = element
      while (inputElement && 
             !(inputElement instanceof HTMLInputElement) && 
             !(inputElement instanceof HTMLTextAreaElement)) {
        inputElement = inputElement.parentElement
      }

      setSelection({
        text: selectedText,
        range: range.cloneRange(),
        rect,
        element,
        inputElement: inputElement as HTMLInputElement | HTMLTextAreaElement | null,
        selectionStart: (inputElement as any)?.selectionStart || 0,
        selectionEnd: (inputElement as any)?.selectionEnd || 0,
      })
    }, delay)
  }, [minLength, containerSelector, delay])

  /**
   * 清除选中
   */
  const clearSelection = useCallback(() => {
    setSelection(null)
    window.getSelection()?.removeAllRanges()
  }, [])

  /**
   * 替换选中的文字（适配 React 受控组件）
   */
  const replaceSelection = useCallback((newText: string) => {
    if (!selection?.element) return false

    try {
      // 查找最近的 input 或 textarea 元素
      let inputElement: HTMLElement | null = selection.element
      while (inputElement && 
             !(inputElement instanceof HTMLInputElement) && 
             !(inputElement instanceof HTMLTextAreaElement)) {
        inputElement = inputElement.parentElement
      }

      if (!inputElement) {
        console.error('未找到 input/textarea 元素')
        return false
      }

      const element = inputElement as HTMLInputElement | HTMLTextAreaElement
      const currentValue = element.value
      const start = element.selectionStart || 0
      const end = element.selectionEnd || 0

      // 计算新值（替换选中部分）
      const newValue = currentValue.substring(0, start) + newText + currentValue.substring(end)

      // 设置新值
      element.value = newValue

      // 触发 React 的 input 事件
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        element.constructor.prototype,
        'value'
      )?.set
      nativeInputValueSetter?.call(element, newValue)

      // 触发 input 和 change 事件
      const inputEvent = new Event('input', { bubbles: true })
      const changeEvent = new Event('change', { bubbles: true })
      element.dispatchEvent(inputEvent)
      element.dispatchEvent(changeEvent)

      // 设置光标位置到替换文字的末尾
      const newCursorPos = start + newText.length
      element.setSelectionRange(newCursorPos, newCursorPos)
      element.focus()

      clearSelection()
      return true
    } catch (error) {
      console.error('Replace selection error:', error)
      return false
    }
  }, [selection, clearSelection])

  useEffect(() => {
    // 监听选中变化
    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [handleSelectionChange])

  return {
    selection,
    clearSelection,
    replaceSelection,
  }
}

