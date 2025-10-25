/**
 * @description 周选择器组件
 * */
export interface IQuestionWeekPickerProps {
  // 周选择器标题
  title?: string
  // 提示信息
  placeholder?: string
  // 日期格式
  format?: string
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionWeekPickerProps) => void
}

export const QuestionWeekPickerDefaultData: IQuestionWeekPickerProps = {
  title: '周选择',
  placeholder: '请选择周',
  format: 'YYYY-wo',
  disabled: false,
}

