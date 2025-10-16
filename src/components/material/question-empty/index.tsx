import React, { FC } from 'react'
import { Empty, Button } from 'antd'
import { IQuestionEmptyProps, QuestionEmptyDefaultProps } from './interface'

const QuestionEmpty: React.FC<IQuestionEmptyProps> = (props) => {
  const {
    description = '暂无数据',
    imageStyle = 'default',
    showButton = false,
    buttonText = '立即创建',
  } = {
    ...QuestionEmptyDefaultProps,
    ...props,
  }

  return (
    <div style={{ width: '100%', maxWidth: 400, padding: '40px 0', textAlign: 'center' }}>
      <Empty
        image={imageStyle === 'simple' ? Empty.PRESENTED_IMAGE_SIMPLE : Empty.PRESENTED_IMAGE_DEFAULT}
        description={description}
      >
        {showButton && (
          <Button type="primary">{buttonText}</Button>
        )}
      </Empty>
    </div>
  )
}

export default QuestionEmpty

