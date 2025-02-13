import React from 'react'
import { Form, Input, Checkbox } from 'antd'
import { IQuestionTitleProps } from './interface'

const TitleProps: React.FC<IQuestionTitleProps> = (
  props: IQuestionTitleProps
) => {
  const { text, level, isCenter } = props
  return (
    <Form layout="vertical" initialValues={{ text, level, isCenter }}></Form>
  )
}

export default TitleProps
