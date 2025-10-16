import React, { FC } from 'react'
import { Tabs } from 'antd'
import { IQuestionTabsProps, QuestionTabsDefaultProps } from './interface'

const QuestionTabs: React.FC<IQuestionTabsProps> = (props) => {
  const {
    items,
    defaultActiveKey = '1',
    tabPosition = 'top',
    size = 'middle',
    type = 'line',
  } = {
    ...QuestionTabsDefaultProps,
    ...props,
  }

  return (
    <div style={{ width: '100%', maxWidth: 800 }}>
      <Tabs
        items={items}
        defaultActiveKey={defaultActiveKey}
        tabPosition={tabPosition}
        size={size}
        type={type}
      />
    </div>
  )
}

export default QuestionTabs

