import React from 'react'
import { Input, Typography, Space } from 'antd'
import { IQuestionOtpInputProps, QuestionOtpInputDefaultData } from './interface.ts'

const { OTP } = Input

const QuestionOtpInput: React.FC<IQuestionOtpInputProps> = (
  props: IQuestionOtpInputProps
) => {
  const { title, length, masked, size, disabled, onChange } = {
    ...QuestionOtpInputDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value

  const handleChange = (value: string) => {
    if (onChange) {
      // 答题模式：直接传递验证码字符串
      ;(onChange as any)(value)
    }
  }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <Space direction="vertical" className="w-full">
        <OTP
          value={externalValue}
          length={length}
          mask={masked}
          size={size}
          onChange={handleChange}
          disabled={disabled}
        />
      </Space>
    </div>
  )
}

export default QuestionOtpInput

