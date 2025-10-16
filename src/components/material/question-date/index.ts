import QuestionDate from './index.tsx'
import { QuestionDateDefaultProps } from './interface.ts'
import dateProps from './date-props.tsx'

export * from './interface.ts'

export default {
  title: '日期选择',
  type: 'question-date',
  PropComponent: dateProps,
  component: QuestionDate,
  defaultProps: QuestionDateDefaultProps,
}

