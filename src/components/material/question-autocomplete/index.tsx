import React from 'react'
import type { IQuestionAutocompleteProps } from './interface.ts'
import { QuestionAutocompleteDefaultData } from './interface.ts'
import { AutoComplete } from 'antd'

const QuestionAutocomplete: React.FC<IQuestionAutocompleteProps> = (
  props: IQuestionAutocompleteProps
) => {
  const { placeholder, options, filterOption, disabled, allowClear } = {
    ...QuestionAutocompleteDefaultData,
    ...props,
  }

  const handleSelect = (value: string) => {
    console.log('Selected:', value)
  }

  const handleSearch = (value: string) => {
    console.log('Searching:', value)
  }

  return (
    <AutoComplete
      placeholder={placeholder}
      options={options}
      filterOption={filterOption}
      disabled={disabled}
      allowClear={allowClear}
      onSelect={handleSelect}
      onSearch={handleSearch}
      style={{ width: '100%', minWidth: 200 }}
    />
  )
}

export default QuestionAutocomplete

