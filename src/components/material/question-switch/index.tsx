import React from 'react'
import { Switch, Typography, Space } from 'antd'
import { IQuestionSwitchProps, QuestionSwitchDefaultData } from './interface.ts'

const QuestionSwitch: React.FC<IQuestionSwitchProps> = (
  props: IQuestionSwitchProps
) => {
  const { title, defaultChecked, checkedText, unCheckedText, disabled, loading, onChange } = {
    ...QuestionSwitchDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value

  const handleChange = (checked: boolean) => {
    if (onChange) {
      // 答题模式：直接传递布尔值
      ;(onChange as any)(checked)
    }
  }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <Space>
        <Switch
          checked={externalValue !== undefined ? externalValue : defaultChecked}
          checkedChildren={checkedText}
          unCheckedChildren={unCheckedText}
          onChange={handleChange}
          disabled={disabled}
          loading={loading}
        />
      </Space>
    </div>
  )
}

export default QuestionSwitch

