import QuestionNPS from './index.tsx'
import { QuestionNPSDefaultProps } from './interface'
import NPSProps from './nps-props.tsx'

export * from './interface'

export default {
  title: 'NPS评分器',
  type: 'question-nps',
  PropComponent: NPSProps,
  component: QuestionNPS,
  defaultProps: QuestionNPSDefaultProps,
}

