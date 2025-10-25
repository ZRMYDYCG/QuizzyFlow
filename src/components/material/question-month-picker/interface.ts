/**
 * @description 月份选择器组件
 * */
export interface IQuestionMonthPickerProps {
  // 月份选择器标题
  title?: string
  // 提示信息
  placeholder?: string
  // 日期格式
  format?: string
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionMonthPickerProps) => void
}

export const QuestionMonthPickerDefaultData: IQuestionMonthPickerProps = {
  title: '月份选择',
  placeholder: '请选择月份',
  format: 'YYYY-MM',
  disabled: false,
}

