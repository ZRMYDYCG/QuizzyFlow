import QuestionNumberInput from './index.tsx'
import { QuestionNumberInputDefaultData } from './interface.ts'
import NumberInputProps from './number-input-props.tsx'

export * from './interface.ts'

export default {
  title: '数字输入框',
  type: 'question-number-input',
  PropComponent: NumberInputProps,
  component: QuestionNumberInput,
  defaultProps: QuestionNumberInputDefaultData,
}

