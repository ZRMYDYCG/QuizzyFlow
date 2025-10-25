/**
 * @description 时间范围选择器组件
 * */
export interface IQuestionTimeRangePickerProps {
  // 时间范围选择器标题
  title?: string
  // 提示信息
  placeholder?: [string, string]
  // 时间格式
  format?: string
  // 是否使用12小时制
  use12Hours?: boolean
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionTimeRangePickerProps) => void
}

export const QuestionTimeRangePickerDefaultData: IQuestionTimeRangePickerProps = {
  title: '时间范围选择',
  placeholder: ['开始时间', '结束时间'],
  format: 'HH:mm:ss',
  use12Hours: false,
  disabled: false,
}

