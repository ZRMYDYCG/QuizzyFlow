import React from 'react'
import { TreeSelect, Typography } from 'antd'
import { IQuestionTreeSelectProps, QuestionTreeSelectDefaultData } from './interface.ts'

const QuestionTreeSelect: React.FC<IQuestionTreeSelectProps> = (
  props: IQuestionTreeSelectProps
) => {
  const { title, placeholder, treeData, multiple, showSearch, disabled, onChange } = {
    ...QuestionTreeSelectDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value

  const handleChange = (value: string | string[]) => {
    if (onChange) {
      // 答题模式：传递选中的值
      ;(onChange as any)(value)
    }
  }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <div>
        <TreeSelect
          value={externalValue}
          placeholder={placeholder}
          treeData={treeData}
          multiple={multiple}
          showSearch={showSearch}
          onChange={handleChange}
          disabled={disabled}
          className="w-full"
          treeDefaultExpandAll
        />
      </div>
    </div>
  )
}

export default QuestionTreeSelect

