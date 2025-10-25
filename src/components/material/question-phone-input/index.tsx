import React from 'react'
import { Input, Typography, Select, Space } from 'antd'
import { PhoneOutlined } from '@ant-design/icons'
import type { ChangeEvent } from 'react'
import { IQuestionPhoneInputProps, QuestionPhoneInputDefaultData } from './interface.ts'

const QuestionPhoneInput: React.FC<IQuestionPhoneInputProps> = (
  props: IQuestionPhoneInputProps
) => {
  const { title, placeholder, countryCode, showCountryCode, disabled, onChange } = {
    ...QuestionPhoneInputDefaultData,
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

  const selectBefore = showCountryCode ? (
    <Select defaultValue={countryCode} style={{ width: 80 }} disabled={disabled}>
      <Select.Option value="+86">+86</Select.Option>
      <Select.Option value="+1">+1</Select.Option>
      <Select.Option value="+44">+44</Select.Option>
      <Select.Option value="+81">+81</Select.Option>
      <Select.Option value="+82">+82</Select.Option>
    </Select>
  ) : undefined

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <div>
        <Input
          value={externalValue}
          placeholder={placeholder}
          addonBefore={selectBefore}
          prefix={<PhoneOutlined />}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default QuestionPhoneInput

