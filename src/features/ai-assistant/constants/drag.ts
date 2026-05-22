/** 画布问卷项拖入 AI 对话时使用的 MIME 类型 */
export const QUESTION_COMPONENT_DRAG_MIME =
  'application/x-quizzyflow-question-component'

export const QUESTION_COMPONENT_DRAG_START_EVENT =
  'quizzyflow:question-component-drag-start'

export const QUESTION_COMPONENT_DRAG_END_EVENT =
  'quizzyflow:question-component-drag-end'

export function notifyQuestionComponentDragStart() {
  window.dispatchEvent(new CustomEvent(QUESTION_COMPONENT_DRAG_START_EVENT))
}

export function notifyQuestionComponentDragEnd() {
  window.dispatchEvent(new CustomEvent(QUESTION_COMPONENT_DRAG_END_EVENT))
}

export function isQuestionComponentDragEvent(
  e: React.DragEvent | DragEvent,
): boolean {
  const types = e.dataTransfer?.types
  if (!types) return false
  return (
    types.includes(QUESTION_COMPONENT_DRAG_MIME) ||
    types.includes('text/plain')
  )
}
