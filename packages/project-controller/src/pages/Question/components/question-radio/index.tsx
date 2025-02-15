import { FC } from 'react'
import { Typography, Radio, Space } from 'antd'
import { IQuestionRadioProps, QuestionRadioDefaultProps } from './interface'

const QuestionRadio: FC<IQuestionRadioProps> = (props: IQuestionRadioProps) => {
  const { title, options, value, isVertical } = {
    ...QuestionRadioDefaultProps,
    ...props,
  }
  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <Radio.Group value={value}>
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
