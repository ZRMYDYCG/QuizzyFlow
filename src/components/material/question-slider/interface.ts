export interface IQuestionSliderProps {
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  range?: boolean
  marks?: boolean
  label?: string
  showValue?: boolean
  onChange?: (newProps: IQuestionSliderProps) => void
  disabled?: boolean
}

export const QuestionSliderDefaultProps: IQuestionSliderProps = {
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 50,
  range: false,
  marks: true,
  label: '请选择数值',
  showValue: true,
}

