import React, { FC } from 'react'
import { Result, Button } from 'antd'
import { IQuestionResultProps, QuestionResultDefaultProps } from './interface'

const QuestionResult: React.FC<IQuestionResultProps> = (props) => {
  const {
    status = 'success',
    title = '提交成功',
    subTitle,
    showButton = true,
    buttonText = '返回首页',
  } = {
    ...QuestionResultDefaultProps,
    ...props,
  }

  return (
    <div style={{ width: '100%', maxWidth: 600, padding: '40px 0' }}>
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={
          showButton ? (
            <Button type="primary">{buttonText}</Button>
          ) : null
        }
      />
    </div>
  )
}

export default QuestionResult

