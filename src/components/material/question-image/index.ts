import QuestionImage from './index.tsx'
import { QuestionImageDefaultProps } from './interface.ts'
import imageProps from './image-props.tsx'

export * from './interface.ts'

export default {
  title: '图片',
  type: 'question-image',
  PropComponent: imageProps,
  component: QuestionImage,
  defaultProps: QuestionImageDefaultProps,
}

