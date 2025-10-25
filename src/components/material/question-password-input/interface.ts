/**
 * @description 密码输入框组件
 * */
export interface IQuestionPasswordInputProps {
  // 密码输入框标题
  title?: string
  // 提示信息
  placeholder?: string
  // 是否显示切换密码可见性的按钮
  visibilityToggle?: boolean
  // 最大长度
  maxLength?: number
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionPasswordInputProps) => void
}

export const QuestionPasswordInputDefaultData: IQuestionPasswordInputProps = {
  title: '密码输入',
  placeholder: '请输入密码',
  visibilityToggle: true,
  maxLength: 50,
  disabled: false,
}

