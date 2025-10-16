export interface IQuestionHighlightProps {
  text?: string
  backgroundColor?: string
  textColor?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  animation?: 'none' | 'blink' | 'breath'
  onChange?: (newProps: IQuestionHighlightProps) => void
  disabled?: boolean
}

export const QuestionHighlightDefaultProps: IQuestionHighlightProps = {
  text: '这是高亮文本',
  backgroundColor: '#fff566',
  textColor: '#000000',
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  animation: 'none',
}

