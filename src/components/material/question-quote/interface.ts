export interface IQuestionQuoteProps {
  text?: string
  author?: string
  isItalic?: boolean
  iconType?: 'quote' | 'info' | 'warning' | 'none'
  bgColor?: string
  borderColor?: string
  onChange?: (newProps: IQuestionQuoteProps) => void
  disabled?: boolean
}

export const QuestionQuoteDefaultProps: IQuestionQuoteProps = {
  text: '这是一段引用文本',
  author: '',
  isItalic: true,
  iconType: 'quote',
  bgColor: '#f9f9f9',
  borderColor: '#1890ff',
}

