import QuestionEmailInput from './index.tsx'
import { QuestionEmailInputDefaultData } from './interface.ts'
import EmailInputProps from './email-input-props.tsx'

export * from './interface.ts'

export default {
  title: '邮箱输入框',
  type: 'question-email-input',
  PropComponent: EmailInputProps,
  component: QuestionEmailInput,
  defaultProps: QuestionEmailInputDefaultData,
}

