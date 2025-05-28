import { FC } from 'react'
import {
  IQuestionCheckboxProps,
  QuestionCheckboxDefaultProps,
} from './interface'
import { Typography, Space, Checkbox } from 'antd'

const QuestionCheckbox: FC<IQuestionCheckboxProps> = (props) => {
  const {
    title,
    isVertical,
    list = [],
  } = { ...QuestionCheckboxDefaultProps, ...props }
  return (
    <div>
      <Typography.Paragraph>{title}</Typography.Paragraph>
      <Space direction={isVertical ? 'vertical' : 'horizontal'}>
        {list.map((opt) => {
          const { value, text, checked } = opt
          return (
            <Checkbox key={value} value={value} checked={checked}>
              {text}
            </Checkbox>
          )
        })}
      </Space>
    </div>
  )
}

export default QuestionCheckbox
