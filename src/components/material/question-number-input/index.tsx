import React from 'react'
import { InputNumber, Typography } from 'antd'
import { IQuestionNumberInputProps, QuestionNumberInputDefaultData } from './interface.ts'

const QuestionNumberInput: React.FC<IQuestionNumberInputProps> = (
  props: IQuestionNumberInputProps
) => {
  const { title, placeholder, min, max, step, precision, disabled, onChange } = {
    ...QuestionNumberInputDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value

  const handleChange = (value: number | null) => {
    if (onChange) {
      // 答题模式：直接传递数字值
      ;(onChange as any)(value)
    }
  }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <div>
        <InputNumber
          value={externalValue}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          precision={precision}
          onChange={handleChange}
          disabled={disabled}
          className="w-full"
        />
      </div>
    </div>
  )
}

export default QuestionNumberInput

