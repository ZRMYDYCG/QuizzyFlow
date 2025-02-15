export interface QuestionParagraphProps {
  text?: string
  isCenter?: boolean
  onChange?: (newProps: QuestionParagraphProps) => void
  disabled?: boolean
}

export const QuestionParagraphDefaultProps: QuestionParagraphProps = {
  text: '段落',
  isCenter: false,
}
