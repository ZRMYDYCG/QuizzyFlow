import QuestionTextarea from './index.tsx'
import { QuestionTextareaDefaultData } from './interface.ts'
import TextareaProps from './textarea-props.tsx'

export * from './interface.ts'

export default {
  title: '多行输入',
  type: 'question-textarea',
  PropComponent: TextareaProps,
  component: QuestionTextarea,
  defaultProps: QuestionTextareaDefaultData,
}
