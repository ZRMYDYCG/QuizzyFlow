import React, { FC } from 'react'
import { Descriptions } from 'antd'
import { IQuestionDescriptionsProps, QuestionDescriptionsDefaultProps } from './interface'

const QuestionDescriptions: React.FC<IQuestionDescriptionsProps> = (props) => {
  const {
    title,
    items,
    column = 2,
    bordered = true,
    size = 'default',
    layout = 'horizontal',
  } = {
    ...QuestionDescriptionsDefaultProps,
    ...props,
  }

  const descItems = items.map((item, index) => ({
    key: String(index),
    label: item.label,
    children: item.content,
  }))

  return (
    <div style={{ width: '100%', maxWidth: 800 }}>
      <Descriptions
        title={title}
        items={descItems}
        column={column}
        bordered={bordered}
        size={size}
        layout={layout}
      />
    </div>
  )
}

export default QuestionDescriptions

