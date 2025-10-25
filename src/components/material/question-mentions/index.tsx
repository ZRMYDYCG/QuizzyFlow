import React from 'react'
import { Mentions, Typography } from 'antd'
import { IQuestionMentionsProps, QuestionMentionsDefaultData } from './interface.ts'

const QuestionMentions: React.FC<IQuestionMentionsProps> = (
  props: IQuestionMentionsProps
) => {
  const { title, placeholder, prefix, options, disabled, onChange } = {
    ...QuestionMentionsDefaultData,
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
          onChange={handleChange}
          disabled={disabled}
          options={options}
          rows={3}
        />
      </div>
    </div>
  )
}

export default QuestionMentions

