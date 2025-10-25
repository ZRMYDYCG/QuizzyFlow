import React from 'react'
import { Input, Typography } from 'antd'
import type { ChangeEvent } from 'react'
import { IQuestionPasswordInputProps, QuestionPasswordInputDefaultData } from './interface.ts'

const QuestionPasswordInput: React.FC<IQuestionPasswordInputProps> = (
  props: IQuestionPasswordInputProps
) => {
  const { title, placeholder, visibilityToggle, maxLength, disabled, onChange } = {
    ...QuestionPasswordInputDefaultData,
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
        <Input.Password
          value={externalValue}
          placeholder={placeholder}
          visibilityToggle={visibilityToggle}
          maxLength={maxLength}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default QuestionPasswordInput

