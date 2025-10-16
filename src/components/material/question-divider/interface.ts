export interface IQuestionDividerProps {
  lineType?: 'solid' | 'dashed' | 'dotted'
  text?: string
  textPosition?: 'left' | 'center' | 'right'
  thickness?: number
  color?: string
  enableGradient?: boolean
  gradientStartColor?: string
  gradientEndColor?: string
  onChange?: (newProps: IQuestionDividerProps) => void
  disabled?: boolean
}

export const QuestionDividerDefaultProps: IQuestionDividerProps = {
  lineType: 'solid',
  text: '',
  textPosition: 'center',
  thickness: 1,
  color: '#d9d9d9',
  enableGradient: false,
  gradientStartColor: '#1890ff',
  gradientEndColor: '#722ed1',
}

