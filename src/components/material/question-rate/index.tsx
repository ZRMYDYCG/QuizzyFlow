import { FC } from 'react'
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
    onChange,
  } = {
    ...QuestionRateDefaultProps,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value
  const currentValue = externalValue !== undefined ? externalValue : defaultValue

  const handleChange = (newValue: number) => {
    if (onChange) {
      ;(onChange as any)(newValue)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        {label && <Text>{label}</Text>}
        <Space wrap>
          <Rate
            count={count}
            allowHalf={allowHalf}
            allowClear={allowClear}
            value={currentValue}
            onChange={handleChange}
            style={{ color }}
          />
          {showValue && currentValue > 0 && (
            <Text type="secondary">
              {currentValue} {allowHalf ? '星' : `/ ${count}`}
            </Text>
          )}
        </Space>
      </Space>
    </div>
  )
}

export default QuestionRate

