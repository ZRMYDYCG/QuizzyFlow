import React from 'react'
import type { IQuestionSelectProps } from './interface.ts'
import { QuestionSelectDefaultData } from './interface.ts'
import { Select } from 'antd'

const QuestionSelect: React.FC<IQuestionSelectProps> = (
  props: IQuestionSelectProps
) => {
  const {
    placeholder,
    options,
    mode,
    allowClear,
    showSearch,
    disabled,
    size,
    maxTagCount,
  } = {
    ...QuestionSelectDefaultData,
    ...props,
  }

  const handleChange = (value: any) => {
    console.log('Selected:', value)
  }

  return (
    <Select
      placeholder={placeholder}
      options={options}
      mode={mode === 'default' ? undefined : mode}
      allowClear={allowClear}
      showSearch={showSearch}
      disabled={disabled}
      size={size}
      maxTagCount={maxTagCount}
      onChange={handleChange}
      style={{ width: '100%', minWidth: 200 }}
    />
  )
}

export default QuestionSelect

