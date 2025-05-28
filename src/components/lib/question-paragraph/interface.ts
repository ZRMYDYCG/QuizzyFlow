export interface IQuestionParagraphProps {
  text?: string
  isCenter?: boolean
  onChange?: (newProps: IQuestionParagraphProps) => void
  disabled?: boolean
}

export const QuestionParagraphDefaultProps: IQuestionParagraphProps = {
  text: '段落',
  isCenter: false,
}
