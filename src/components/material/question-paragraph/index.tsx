import { FC } from 'react'
import { Typography } from 'antd'
import {
  IQuestionParagraphProps,
  QuestionParagraphDefaultProps,
} from './interface.ts'

const QuestionParagraph: FC<IQuestionParagraphProps> = (
  props: IQuestionParagraphProps
) => {
  const { text = '', isCenter = false } = {
    ...QuestionParagraphDefaultProps,
    ...props,
  }

  const textList = text.split('\n')
  return (
    <Typography.Paragraph
      style={{ textAlign: isCenter ? 'center' : 'start', marginBottom: 0 }}
    >
      {textList.map((item, index) => (
        <span key={index}>
          {index > 0 && <br />}
          {item}
        </span>
      ))}
    </Typography.Paragraph>
  )
}

export default QuestionParagraph
