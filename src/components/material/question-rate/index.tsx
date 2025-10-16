import { FC, useState } from 'react'
import { Rate, Space, Typography } from 'antd'
import {
  IQuestionRateProps,
  QuestionRateDefaultProps,
} from './interface.ts'

const { Text } = Typography

const QuestionRate: FC<IQuestionRateProps> = (
  props: IQuestionRateProps
) => {
  const {
    count = 5,
    allowHalf = false,
    allowClear = true,
    color = '#fadb14',
    defaultValue = 0,
    label = '请评分',
    showValue = true,
  } = {
    ...QuestionRateDefaultProps,
    ...props,
  }

  const [value, setValue] = useState(defaultValue)

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        {label && <Text>{label}</Text>}
        <Space wrap>
          <Rate
            count={count}
            allowHalf={allowHalf}
            allowClear={allowClear}
            value={value}
            onChange={setValue}
            style={{ color }}
          />
          {showValue && value > 0 && (
            <Text type="secondary">
              {value} {allowHalf ? '星' : `/ ${count}`}
            </Text>
          )}
        </Space>
      </Space>
    </div>
  )
}

export default QuestionRate

