import React, { useState } from 'react'
import { Tag, Input, Typography, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ChangeEvent, KeyboardEvent } from 'react'
import { IQuestionTagsInputProps, QuestionTagsInputDefaultData } from './interface.ts'

const QuestionTagsInput: React.FC<IQuestionTagsInputProps> = (
  props: IQuestionTagsInputProps
) => {
  const { title, placeholder, maxTags, disabled, onChange } = {
    ...QuestionTagsInputDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value || []
  const [inputValue, setInputValue] = useState('')
  const [inputVisible, setInputVisible] = useState(false)

  const handleClose = (removedTag: string) => {
    const newTags = externalValue.filter((tag: string) => tag !== removedTag)
    if (onChange) {
      ;(onChange as any)(newTags)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputConfirm = () => {
    if (inputValue && externalValue.indexOf(inputValue) === -1) {
      if (!maxTags || externalValue.length < maxTags) {
        const newTags = [...externalValue, inputValue]
        if (onChange) {
          ;(onChange as any)(newTags)
        }
      }
    }
    setInputVisible(false)
    setInputValue('')
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputConfirm()
    }
  }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <Space wrap>
        {externalValue.map((tag: string, index: number) => (
          <Tag
            key={index}
            closable={!disabled}
            onClose={() => handleClose(tag)}
          >
            {tag}
          </Tag>
        ))}
        {inputVisible && (
          <Input
            type="text"
            size="small"
            style={{ width: 120 }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
          />
        )}
        {!inputVisible && (!maxTags || externalValue.length < maxTags) && (
          <Tag
            onClick={() => !disabled && setInputVisible(true)}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          >
            <PlusOutlined /> 添加标签
          </Tag>
        )}
      </Space>
    </div>
  )
}

export default QuestionTagsInput

