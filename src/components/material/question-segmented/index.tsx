import React from 'react'
import { Segmented, Typography } from 'antd'
import { IQuestionSegmentedProps, QuestionSegmentedDefaultData } from './interface.ts'

const QuestionSegmented: React.FC<IQuestionSegmentedProps> = (
  props: IQuestionSegmentedProps
) => {
  const { title, options, disabled, block, size, onChange } = {
    ...QuestionSegmentedDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value
  // 如果没有外部值且有选项，使用第一个选项的值作为默认值
  const defaultValue = options && options.length > 0 ? options[0].value : undefined
  const currentValue = externalValue !== undefined && externalValue !== null ? externalValue : defaultValue

  const handleChange = (value: string | number) => {
    if (onChange) {
      // 答题模式：传递选中的值
      ;(onChange as any)(value)
    }
  }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <div>
        <Segmented
          value={currentValue}
          options={options || []}
          onChange={handleChange}
          disabled={disabled}
          block={block}
          size={size}
        />
      </div>
    </div>
  )
}

export default QuestionSegmented

