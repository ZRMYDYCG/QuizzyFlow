/**
 * @description 时间选择器组件
 * */
export interface IQuestionTimePickerProps {
  // 时间选择器标题
  title?: string
  // 提示信息
  placeholder?: string
  // 时间格式
  format?: string
  // 是否使用12小时制
  use12Hours?: boolean
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionTimePickerProps) => void
}

export const QuestionTimePickerDefaultData: IQuestionTimePickerProps = {
  title: '时间选择',
  placeholder: '请选择时间',
  format: 'HH:mm:ss',
  use12Hours: false,
  disabled: false,
}

