import QuestionRate from './index.tsx'
import { QuestionRateDefaultProps } from './interface.ts'
import rateProps from './rate-props.tsx'

export * from './interface.ts'

export default {
  title: '评分',
  type: 'question-rate',
  PropComponent: rateProps,
  component: QuestionRate,
  defaultProps: QuestionRateDefaultProps,
}

