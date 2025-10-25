import React from 'react'
import { Mentions, Typography } from 'antd'
import { IQuestionMentionTextareaProps, QuestionMentionTextareaDefaultData } from './interface.ts'

const QuestionMentionTextarea: React.FC<IQuestionMentionTextareaProps> = (
  props: IQuestionMentionTextareaProps
) => {
  const { title, placeholder, rows, prefix, options, maxLength, disabled, onChange } = {
    ...QuestionMentionTextareaDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value

  const handleChange = (value: string) => {
    if (onChange) {
      // 答题模式：直接传递输入的字符串值
      ;(onChange as any)(value)
    }
  }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <div>
        <Mentions
          value={externalValue}
          placeholder={placeholder}
          prefix={prefix}
          rows={rows}
          maxLength={maxLength}
          onChange={handleChange}
          disabled={disabled}
          options={options}
        />
      </div>
    </div>
  )
}

export default QuestionMentionTextarea

