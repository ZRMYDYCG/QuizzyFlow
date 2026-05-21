import { useMemo } from 'react'
import {
  computeLinkageRuntimeState,
  isInteractiveComponent,
} from '@/features/material-linkage'
import type { MaterialLinkageRule } from '@/features/material-linkage'
import type { QuestionComponentType } from '@/store/modules/question-component'
import { isAnswerFilled } from '../utils/is-answer-filled'

export function useAnswerProgress(
  componentList: QuestionComponentType[],
  linkages: MaterialLinkageRule[],
  answerValues: Record<string, unknown>
) {
  const linkageRuntime = useMemo(
    () => computeLinkageRuntimeState(componentList, linkages, answerValues),
    [componentList, linkages, answerValues]
  )

  return useMemo(() => {
    const interactive = componentList.filter(
      (item) =>
        !item.isHidden &&
        !linkageRuntime.hiddenById[item.fe_id] &&
        isInteractiveComponent(item.type)
    )
    const answered = interactive.filter((item) =>
      isAnswerFilled(answerValues[item.fe_id])
    )
    const total = interactive.length
    const done = answered.length
    const percent = total === 0 ? 0 : Math.round((done / total) * 100)

    return { total, done, percent, linkageRuntime }
  }, [componentList, answerValues, linkageRuntime])
}
