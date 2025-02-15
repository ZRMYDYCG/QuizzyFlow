import { FC } from 'react'
import { Typography } from 'antd'
import {
  QuestionParagraphProps,
  QuestionParagraphDefaultProps,
} from './interface'

const QuestionParagraph: FC<QuestionParagraphProps> = (
  props: QuestionParagraphProps
) => {
  const { text = '', isCenter = false } = {
    ...QuestionParagraphDefaultProps,
    ...props,
  }
  return (
    <Typography.Paragraph
      style={{ textAlign: isCenter ? 'center' : 'start', marginBottom: 0 }}
    >
      {text}
    </Typography.Paragraph>
  )
}

export default QuestionParagraph
