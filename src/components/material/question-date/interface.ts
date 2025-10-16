export interface IQuestionDateProps {
  mode?: 'date' | 'time' | 'datetime' | 'range'
  format?: string
  label?: string
  placeholder?: string
  showTime?: boolean
  onChange?: (newProps: IQuestionDateProps) => void
  disabled?: boolean
}

export const QuestionDateDefaultProps: IQuestionDateProps = {
  mode: 'date',
  format: 'YYYY-MM-DD',
  label: '请选择日期',
  placeholder: '请选择',
  showTime: false,
}

