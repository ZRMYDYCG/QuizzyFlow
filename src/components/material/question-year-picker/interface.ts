/**
 * @description 年份选择器组件
 * */
export interface IQuestionYearPickerProps {
  // 年份选择器标题
  title?: string
  // 提示信息
  placeholder?: string
  // 日期格式
  format?: string
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionYearPickerProps) => void
}

export const QuestionYearPickerDefaultData: IQuestionYearPickerProps = {
  title: '年份选择',
  placeholder: '请选择年份',
  format: 'YYYY',
  disabled: false,
}

