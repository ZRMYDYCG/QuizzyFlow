/**
 * @description 验证码输入组件
 * */
export interface IQuestionOtpInputProps {
  // 验证码输入标题
  title?: string
  // 验证码长度
  length?: number
  // 是否显示为密码
  masked?: boolean
  // 输入框大小
  size?: 'large' | 'middle' | 'small'
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionOtpInputProps) => void
}

export const QuestionOtpInputDefaultData: IQuestionOtpInputProps = {
  title: '验证码输入',
  length: 6,
  masked: false,
  size: 'middle',
  disabled: false,
}

