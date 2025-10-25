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
    onChange,
  } = {
    ...QuestionSelectDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value
  
  // 根据 mode 确定默认值
  const getDefaultValue = () => {
    // 如果有外部值且不为 null，使用外部值
    if (externalValue !== undefined && externalValue !== null) {
      return externalValue
    }
    // multiple 和 tags 模式需要数组，default 模式需要 undefined
    return mode === 'multiple' || mode === 'tags' ? [] : undefined
  }
  
  const currentValue = getDefaultValue()

  const handleChange = (value: any) => {
    if (onChange) {
      // 答题模式：直接传递选中的值
      // 确保清空时返回正确的空值
      if (value === undefined || value === null) {
        const emptyValue = mode === 'multiple' || mode === 'tags' ? [] : null
        ;(onChange as any)(emptyValue)
      } else {
        ;(onChange as any)(value)
      }
    }
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
      value={currentValue}
      onChange={handleChange}
      style={{ width: '100%', minWidth: 200 }}
    />
  )
}

export default QuestionSelect

