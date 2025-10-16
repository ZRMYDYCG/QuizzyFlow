export interface IQuestionRateProps {
  count?: number
  allowHalf?: boolean
  allowClear?: boolean
  color?: string
  defaultValue?: number
  label?: string
  showValue?: boolean
  onChange?: (newProps: IQuestionRateProps) => void
  disabled?: boolean
}

export const QuestionRateDefaultProps: IQuestionRateProps = {
  count: 5,
  allowHalf: false,
  allowClear: true,
  color: '#fadb14',
  defaultValue: 0,
  label: '请评分',
  showValue: true,
}

