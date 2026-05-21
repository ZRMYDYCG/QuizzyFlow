import type { AnswerItem } from '@/api/modules/answer'
import type { QuestionComponentType } from '@/store/modules/question-component'
import {
  computeLinkageRuntimeState,
  isInteractiveComponent,
} from '@/features/material-linkage'
import type { MaterialLinkageRule } from '@/features/material-linkage'

function normalizeAnswerValue(
  item: QuestionComponentType,
  value: unknown
): unknown {
  if (value === undefined || value === '') {
    return null
  }
  if (item.type === 'question-checkbox' && Array.isArray(value)) {
    return value
  }
  if (item.type === 'question-date' && value) {
    if (Array.isArray(value)) {
      return value.map((v: { format?: (f: string) => string }) =>
        v?.format?.('YYYY-MM-DD') ?? v
      )
    }
    const dateVal = value as { format?: (f: string) => string }
    if (dateVal.format) {
      return dateVal.format('YYYY-MM-DD HH:mm:ss')
    }
    return value
  }
  if (value === null) {
    return null
  }
  return value
}

export function buildAnswerList(
  componentList: QuestionComponentType[],
  linkages: MaterialLinkageRule[],
  answerValues: Record<string, unknown>
): AnswerItem[] {
  const runtime = computeLinkageRuntimeState(
    componentList,
    linkages,
    answerValues
  )

  return componentList
    .filter(
      (item) =>
        !runtime.hiddenById[item.fe_id] && isInteractiveComponent(item.type)
    )
    .map((item) => ({
      componentId: item.fe_id,
      componentType: item.type,
      value: normalizeAnswerValue(item, answerValues[item.fe_id]),
    }))
}
