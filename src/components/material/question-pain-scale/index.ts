import QuestionPainScale from './index.tsx'
import { QuestionPainScaleDefaultProps } from './interface'
import PainScaleProps from './pain-scale-props.tsx'

export * from './interface'

export default {
  title: '疼痛度量表',
  type: 'question-pain-scale',
  PropComponent: PainScaleProps,
  component: QuestionPainScale,
  defaultProps: QuestionPainScaleDefaultProps,
}

