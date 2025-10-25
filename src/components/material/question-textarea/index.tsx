import React from 'react'
import { Input, Typography } from 'antd'
import type { ChangeEvent } from 'react'
import {
  IQuestionTextareaProps,
  QuestionTextareaDefaultData,
} from './interface.ts'

const QuestionTextarea: React.FC<IQuestionTextareaProps> = (
  props: IQuestionTextareaProps
) => {
  const { title, placeholder, disabled, onChange } = { ...QuestionTextareaDefaultData, ...props }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      // 答题模式：直接传递输入的字符串值
      ;(onChange as any)(e.target.value)
    }
  }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <div>
        <Input.TextArea 
          placeholder={placeholder}
          value={externalValue}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default QuestionTextarea
