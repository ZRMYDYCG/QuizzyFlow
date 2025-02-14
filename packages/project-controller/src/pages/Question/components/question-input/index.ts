import QuestionInput from './index.tsx'
import { QuestionInputDefaultData } from './interface.ts'
import InputProps from './input-props.tsx'

export * from './interface.ts'

export default {
  title: '输入框',
  type: 'question-input',
  PropComponent: InputProps,
  component: QuestionInput,
  defaultProps: QuestionInputDefaultData,
}
