/**
 * 属性面板内可编辑输入框：聚焦即显示 AI 工具栏（有选区时用选区，否则用全文）
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
  /** 是否为拖选片段（否则为全文） */
  isPartialSelection: boolean
}

export interface UseTextSelectionOptions {
  /** 仅监听该容器内，如 [data-text-ai-panel] */
  containerSelector?: string
  delay?: number
}

const EDITABLE_INPUT_TYPES = new Set([
  'checkbox',
  'radio',
  'hidden',
  'button',
  'submit',
  'reset',
  'file',
  'image',
  'color',
  'range',
])

export function isEditableFormField(
  el: Element | null,
): el is HTMLInputElement | HTMLTextAreaElement {
  if (!el || !(el instanceof HTMLElement)) return false

  if (el instanceof HTMLTextAreaElement) {
    return !el.disabled && !el.readOnly
  }

  if (el instanceof HTMLInputElement) {
    const type = (el.type || 'text').toLowerCase()
    if (EDITABLE_INPUT_TYPES.has(type)) return false
    return !el.disabled && !el.readOnly
  }

  return false
}

function getTextRange(input: HTMLInputElement | HTMLTextAreaElement) {
  const value = input.value
  const start = input.selectionStart ?? 0
  const end = input.selectionEnd ?? 0

  if (start !== end) {
    return {
      text: value.substring(start, end),
      selectionStart: start,
      selectionEnd: end,
      isPartialSelection: true,
    }
  }

  return {
    text: value,
    selectionStart: 0,
    selectionEnd: value.length,
    isPartialSelection: false,
  }
}

function buildActiveField(
  input: HTMLInputElement | HTMLTextAreaElement,
): TextSelection {
  const { text, selectionStart, selectionEnd, isPartialSelection } =
    getTextRange(input)

  return {
    text,
    range: null,
    rect: input.getBoundingClientRect(),
    element: input,
    inputElement: input,
    selectionStart,
    selectionEnd,
    isPartialSelection,
  }
}

function isToolbarTarget(node: Node | null): boolean {
  if (!node || !(node instanceof HTMLElement)) return false
  return !!node.closest('[data-text-ai-toolbar]')
}

export const useTextSelection = (options: UseTextSelectionOptions = {}) => {
  const { containerSelector, delay = 80 } = options

  const [selection, setSelection] = useState<TextSelection | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const activeInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
    null,
  )

  const resolveContainer = useCallback((): Element | null => {
    if (!containerSelector) return document.body
    return document.querySelector(containerSelector)
  }, [containerSelector])

  const readActiveField = useCallback(
    (input?: HTMLInputElement | HTMLTextAreaElement | null) => {
      const container = resolveContainer()
      if (!container) {
        setSelection(null)
        return
      }

      const target =
        input ??
        activeInputRef.current ??
        (document.activeElement as HTMLInputElement | HTMLTextAreaElement)

      if (!isEditableFormField(target) || !container.contains(target)) {
        setSelection(null)
        return
      }

      activeInputRef.current = target
      setSelection(buildActiveField(target))
    },
    [resolveContainer],
  )

  const scheduleRead = useCallback(
    (input?: HTMLInputElement | HTMLTextAreaElement | null) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => readActiveField(input), delay)
    },
    [readActiveField, delay],
  )

  const clearSelection = useCallback(() => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
    activeInputRef.current = null
    setSelection(null)
  }, [])

  useEffect(() => {
    const container = resolveContainer()
    if (!container) return

    const onFocusIn = (e: FocusEvent) => {
      const target = e.target
      if (!isEditableFormField(target) || !container.contains(target)) return
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
      activeInputRef.current = target
      scheduleRead(target)
    }

    const onFocusOut = (e: FocusEvent) => {
      const related = e.relatedTarget as Node | null
      if (isToolbarTarget(related)) return

      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
      blurTimeoutRef.current = setTimeout(() => {
        const active = document.activeElement
        if (isToolbarTarget(active)) return
        if (isEditableFormField(active) && container.contains(active)) return
        clearSelection()
      }, 120)
    }

    const onSelectionUpdate = () => {
      const input = activeInputRef.current
      if (!input || !container.contains(input)) return
      if (document.activeElement !== input && !container.contains(input)) return
      scheduleRead(input)
    }

    container.addEventListener('focusin', onFocusIn, true)
    container.addEventListener('focusout', onFocusOut, true)
    container.addEventListener('mouseup', onSelectionUpdate)
    container.addEventListener('keyup', onSelectionUpdate)
    document.addEventListener('selectionchange', onSelectionUpdate)

    return () => {
      container.removeEventListener('focusin', onFocusIn, true)
      container.removeEventListener('focusout', onFocusOut, true)
      container.removeEventListener('mouseup', onSelectionUpdate)
      container.removeEventListener('keyup', onSelectionUpdate)
      document.removeEventListener('selectionchange', onSelectionUpdate)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
    }
  }, [resolveContainer, scheduleRead, clearSelection])

  return {
    selection,
    clearSelection,
  }
}
