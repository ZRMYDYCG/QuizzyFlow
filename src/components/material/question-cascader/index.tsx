import React from 'react'
import type { IQuestionCascaderProps } from './interface.ts'
import { QuestionCascaderDefaultData } from './interface.ts'
import { Cascader } from 'antd'

const QuestionCascader: React.FC<IQuestionCascaderProps> = (
  props: IQuestionCascaderProps
) => {
  const {
    placeholder,
    options,
    expandTrigger,
    changeOnSelect,
    showSearch,
    multiple,
    disabled,
  } = {
    ...QuestionCascaderDefaultData,
    ...props,
  }

  const handleChange = (value: any) => {
    console.log('Selected:', value)
  }

  return (
    <Cascader
      placeholder={placeholder}
      options={options}
      expandTrigger={expandTrigger}
      changeOnSelect={changeOnSelect}
      showSearch={showSearch}
      multiple={multiple}
      disabled={disabled}
      onChange={handleChange}
      style={{ width: '100%', minWidth: 200 }}
    />
  )
}

export default QuestionCascader

