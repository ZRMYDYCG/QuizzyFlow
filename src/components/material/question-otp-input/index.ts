import QuestionOtpInput from './index.tsx'
import { QuestionOtpInputDefaultData } from './interface.ts'
import OtpInputProps from './otp-input-props.tsx'

export * from './interface.ts'

export default {
  title: '验证码输入',
  type: 'question-otp-input',
  PropComponent: OtpInputProps,
  component: QuestionOtpInput,
  defaultProps: QuestionOtpInputDefaultData,
}

