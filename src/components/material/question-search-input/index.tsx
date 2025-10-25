import React from 'react'
import { Input, Typography } from 'antd'
import { IQuestionSearchInputProps, QuestionSearchInputDefaultData } from './interface.ts'

const { Search } = Input

const QuestionSearchInput: React.FC<IQuestionSearchInputProps> = (
  props: IQuestionSearchInputProps
) => {
  const { title, placeholder, enterButton, size, disabled, allowClear, onChange } = {
    ...QuestionSearchInputDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      // 答题模式：直接传递输入的字符串值
      ;(onChange as any)(e.target.value)
    }
  }

  const handleSearch = (value: string) => {
    if (onChange) {
      ;(onChange as any)(value)
    }
  }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <div>
        <Search
          value={externalValue}
          placeholder={placeholder}
          enterButton={enterButton}
          size={size}
          allowClear={allowClear}
          onChange={handleChange}
          onSearch={handleSearch}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default QuestionSearchInput

