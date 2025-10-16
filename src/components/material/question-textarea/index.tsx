import React from 'react'
import { Input, Typography } from 'antd'
import {
  IQuestionTextareaProps,
  QuestionTextareaDefaultData,
} from './interface.ts'

const QuestionTextarea: React.FC<IQuestionTextareaProps> = (
  props: IQuestionTextareaProps
) => {
  const { title, placeholder } = { ...QuestionTextareaDefaultData, ...props }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <div>
        <Input.TextArea placeholder={placeholder} />
      </div>
    </div>
  )
}

export default QuestionTextarea
