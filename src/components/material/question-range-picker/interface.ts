/**
 * @description 日期范围选择器组件
 * */
export interface IQuestionRangePickerProps {
  // 日期范围选择器标题
  title?: string
  // 提示信息
  placeholder?: [string, string]
  // 日期格式
  format?: string
  // 是否显示时间选择
  showTime?: boolean
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionRangePickerProps) => void
}

export const QuestionRangePickerDefaultData: IQuestionRangePickerProps = {
  title: '日期范围选择',
  placeholder: ['开始日期', '结束日期'],
  format: 'YYYY-MM-DD',
  showTime: false,
  disabled: false,
}

