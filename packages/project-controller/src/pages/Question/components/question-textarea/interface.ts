/**
 * @description 多行文本输入框组件
 * */
export interface IQuestionTextareaProps {
  // 输入框标题
  title?: string
  // 输入框提示信息
  placeholder?: string
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionTextareaProps) => void
}

export const QuestionTextareaDefaultData: IQuestionTextareaProps = {
  // 输入框标题
  title: '输入框标题',
  // 输入框提示信息
  placeholder: '请输入内容...',
}
