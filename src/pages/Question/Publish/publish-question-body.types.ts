import type { ReactNode } from 'react'
import type { QuestionComponentType } from '@/store/modules/question-component'
import type { MaterialLinkageRule } from '@/features/material-linkage'

export type AnswerValuesMap = { [componentId: string]: unknown }

export interface PublishQuestionBodyProps {
  componentList: QuestionComponentType[]
  linkages: MaterialLinkageRule[]
  displayItems: QuestionComponentType[]
  isAnswerMode: boolean
  answerValues: AnswerValuesMap
  onAnswerValuesChange: (values: AnswerValuesMap) => void
  paginationEnabled: boolean
  visibleCount: number
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  canSubmit: boolean
  submitting: boolean
  onSubmit: () => void
  identitySection?: ReactNode
  headerSection?: ReactNode
  isDark?: boolean
}
