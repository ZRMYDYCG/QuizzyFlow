import QuestionPasswordInput from './index.tsx'
import { QuestionPasswordInputDefaultData } from './interface.ts'
import PasswordInputProps from './password-input-props.tsx'

export * from './interface.ts'

export default {
  title: '密码输入框',
  type: 'question-password-input',
  PropComponent: PasswordInputProps,
  component: QuestionPasswordInput,
  defaultProps: QuestionPasswordInputDefaultData,
}

