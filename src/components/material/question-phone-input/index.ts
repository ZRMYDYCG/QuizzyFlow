import QuestionPhoneInput from './index.tsx'
import { QuestionPhoneInputDefaultData } from './interface.ts'
import PhoneInputProps from './phone-input-props.tsx'

export * from './interface.ts'

export default {
  title: '电话输入框',
  type: 'question-phone-input',
  PropComponent: PhoneInputProps,
  component: QuestionPhoneInput,
  defaultProps: QuestionPhoneInputDefaultData,
}

