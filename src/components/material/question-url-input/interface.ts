/**
 * @description URL输入框组件
 * */
export interface IQuestionUrlInputProps {
  // URL输入框标题
  title?: string
  // 提示信息
  placeholder?: string
  // 是否显示验证状态
  showValidation?: boolean
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionUrlInputProps) => void
}

export const QuestionUrlInputDefaultData: IQuestionUrlInputProps = {
  title: '网址链接',
  placeholder: '请输入网址 (https://...)',
  showValidation: true,
  disabled: false,
}

