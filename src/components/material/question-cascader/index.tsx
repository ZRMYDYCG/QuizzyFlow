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
    onChange,
  } = {
    ...QuestionCascaderDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value
  
  // 根据 multiple 确定默认值
  const currentValue = (externalValue !== undefined && externalValue !== null)
    ? externalValue 
    : (multiple ? [] : undefined)

  const handleChange = (value: any) => {
    if (onChange) {
      // 确保清空时返回正确的空值
      if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
        const emptyValue = multiple ? [] : null
        ;(onChange as any)(emptyValue)
      } else {
        ;(onChange as any)(value)
      }
    }
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
      value={currentValue}
      onChange={handleChange}
      style={{ width: '100%', minWidth: 200 }}
    />
  )
}

export default QuestionCascader

