import React, { FC } from 'react'
import { Statistic, Card } from 'antd'
import { IQuestionStatisticProps, QuestionStatisticDefaultProps } from './interface'

const QuestionStatistic: React.FC<IQuestionStatisticProps> = (props) => {
  const {
    title,
    value,
    prefix,
    suffix,
    precision = 0,
    groupSeparator = ',',
    valueStyle = 'default',
  } = {
    ...QuestionStatisticDefaultProps,
    ...props,
  }

  const getValueColor = () => {
    switch (valueStyle) {
      case 'success':
        return '#52c41a'
      case 'warning':
        return '#faad14'
      case 'danger':
        return '#ff4d4f'
      default:
        return undefined
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 300 }}>
      <Card bordered={false}>
        <Statistic
          title={title}
          value={value}
          prefix={prefix}
          suffix={suffix}
          precision={precision}
          groupSeparator={groupSeparator}
          valueStyle={{ color: getValueColor() }}
        />
      </Card>
    </div>
  )
}

export default QuestionStatistic

