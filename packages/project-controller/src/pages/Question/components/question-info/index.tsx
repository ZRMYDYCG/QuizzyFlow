import React from 'react'
import { Typography } from 'antd'
import { IQuestionInfoProps, QuestionDefaultProps } from './interface.ts'

const QuestionInfo: React.FC<IQuestionInfoProps> = (
  props: IQuestionInfoProps
) => {
  const { title, desc = '' } = { ...QuestionDefaultProps, ...props }

  const descList = desc.split('\n')
  return (
    <div style={{ textAlign: 'center' }}>
      <Typography.Title level={3}>{title}</Typography.Title>
      <Typography.Paragraph>
        {descList.map((item, index) => (
          <span key={index}>
            {index > 0 && <br />}
            {item}
          </span>
        ))}
      </Typography.Paragraph>
    </div>
  )
}

export default QuestionInfo
