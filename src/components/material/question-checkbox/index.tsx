import { FC } from 'react'
import {
  IQuestionCheckboxProps,
  QuestionCheckboxDefaultProps,
} from './interface.ts'
import { Typography, Checkbox, Space } from 'antd'

const QuestionCheckbox: FC<IQuestionCheckboxProps> = (props) => {
  const {
    title,
    isVertical,
    list = [],
    disabled,
    onChange,
  } = { ...QuestionCheckboxDefaultProps, ...props }

  const handleChange = (checkedValues: string[]) => {
    if (onChange) {
      ;(onChange as any)(checkedValues || [])
    }
  }

  // 获取当前选中的值
  const externalValue = (props as any).value
  const selectedValues = externalValue !== undefined
    ? (Array.isArray(externalValue) ? externalValue : [])
    : list.filter((opt) => opt.checked).map((opt) => opt.value)

  return (
    <div>
      <Typography.Paragraph>{title}</Typography.Paragraph>
      <Checkbox.Group
        disabled={disabled}
        value={selectedValues}
        onChange={handleChange}
      >
        <Space direction={isVertical ? 'vertical' : 'horizontal'}>
          {list.map((opt) => {
            const { value, text } = opt
            return (
              <Checkbox key={value} value={value}>
                {text}
              </Checkbox>
            )
          })}
        </Space>
      </Checkbox.Group>
    </div>
  )
}

export default QuestionCheckbox
