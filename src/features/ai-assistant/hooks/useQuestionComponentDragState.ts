import { useEffect, useState } from 'react'
import {
  QUESTION_COMPONENT_DRAG_END_EVENT,
  QUESTION_COMPONENT_DRAG_START_EVENT,
} from '../constants/drag'

/** 画布是否正在拖拽问卷项（用于 AI 面板展示可拖入态） */
export function useQuestionComponentDragState() {
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const onStart = () => setIsDragging(true)
    const onEnd = () => setIsDragging(false)

    window.addEventListener(QUESTION_COMPONENT_DRAG_START_EVENT, onStart)
    window.addEventListener(QUESTION_COMPONENT_DRAG_END_EVENT, onEnd)
    window.addEventListener('dragend', onEnd)

    return () => {
      window.removeEventListener(QUESTION_COMPONENT_DRAG_START_EVENT, onStart)
      window.removeEventListener(QUESTION_COMPONENT_DRAG_END_EVENT, onEnd)
      window.removeEventListener('dragend', onEnd)
    }
  }, [])

  return isDragging
}
