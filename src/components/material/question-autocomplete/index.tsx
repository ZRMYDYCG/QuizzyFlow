import React from 'react'
import type { IQuestionAutocompleteProps } from './interface.ts'
import { QuestionAutocompleteDefaultData } from './interface.ts'
import { AutoComplete } from 'antd'

const QuestionAutocomplete: React.FC<IQuestionAutocompleteProps> = (
  props: IQuestionAutocompleteProps
) => {
  const { placeholder, options, filterOption, disabled, allowClear, onChange } = {
    ...QuestionAutocompleteDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value
  const currentValue = (externalValue !== undefined && externalValue !== null && externalValue !== '') 
    ? externalValue 
    : undefined

  const handleChange = (value: string) => {
    if (onChange) {
      // 确保清空时返回空字符串而不是 undefined
      ;(onChange as any)(value || '')
    }
  }

  return (
    <AutoComplete
      placeholder={placeholder}
      options={options}
      filterOption={filterOption}
      disabled={disabled}
      allowClear={allowClear}
      value={currentValue}
      onChange={handleChange}
      style={{ width: '100%', minWidth: 200 }}
    />
  )
}

export default QuestionAutocomplete

