/**
 * @description 邮箱输入框组件
 * */
export interface IQuestionEmailInputProps {
  // 邮箱输入框标题
  title?: string
  // 提示信息
  placeholder?: string
  // 是否显示验证状态
  showValidation?: boolean
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionEmailInputProps) => void
}

export const QuestionEmailInputDefaultData: IQuestionEmailInputProps = {
  title: '邮箱地址',
  placeholder: '请输入邮箱地址',
  showValidation: true,
  disabled: false,
}

