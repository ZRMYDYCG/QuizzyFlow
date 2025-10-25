import React from 'react'
import { Input, Typography } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import type { ChangeEvent } from 'react'
import { IQuestionUrlInputProps, QuestionUrlInputDefaultData } from './interface.ts'

const QuestionUrlInput: React.FC<IQuestionUrlInputProps> = (
  props: IQuestionUrlInputProps
) => {
  const { title, placeholder, disabled, onChange } = {
    ...QuestionUrlInputDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      // 答题模式：直接传递输入的字符串值
      ;(onChange as any)(e.target.value)
    }
  }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <div>
        <Input
          value={externalValue}
          placeholder={placeholder}
          prefix={<LinkOutlined />}
          type="url"
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default QuestionUrlInput

