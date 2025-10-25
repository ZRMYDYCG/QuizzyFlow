import { FC } from 'react'
import { Typography, Radio, Space } from 'antd'
import { IQuestionRadioProps, QuestionRadioDefaultProps } from './interface.ts'
import type { RadioChangeEvent } from 'antd'

const QuestionRadio: FC<IQuestionRadioProps> = (props: IQuestionRadioProps) => {
  const { title, options, value, isVertical, disabled, onChange } = {
    ...QuestionRadioDefaultProps,
    ...props,
  }

  const handleChange = (e: RadioChangeEvent) => {
    if (onChange) {
      const newValue = e.target.value
      // 答题模式：直接传递选中的值
      // 确保传递的值不是 undefined
      ;(onChange as any)(newValue !== undefined ? newValue : null)
    }
  }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <Radio.Group value={value} onChange={handleChange} disabled={disabled}>
        <Space direction={isVertical ? 'vertical' : 'horizontal'}>
          {options.map((option) => {
            const { value, text } = option
            return (
              <Radio key={value} value={value}>
                {text}
              </Radio>
            )
          })}
        </Space>
      </Radio.Group>
    </div>
  )
}

export default QuestionRadio
