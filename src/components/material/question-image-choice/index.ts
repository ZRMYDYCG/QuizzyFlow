import QuestionImageChoice from './index.tsx'
import { QuestionImageChoiceDefaultProps } from './interface'
import ImageChoiceProps from './image-choice-props.tsx'

export * from './interface'

export default {
  title: '图片选择',
  type: 'question-image-choice',
  PropComponent: ImageChoiceProps,
  component: QuestionImageChoice,
  defaultProps: QuestionImageChoiceDefaultProps,
}

