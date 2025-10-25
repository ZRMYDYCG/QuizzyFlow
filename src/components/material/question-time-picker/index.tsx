import React from 'react'
import { TimePicker, Typography } from 'antd'
import type { Dayjs } from 'dayjs'
import { IQuestionTimePickerProps, QuestionTimePickerDefaultData } from './interface.ts'

const QuestionTimePicker: React.FC<IQuestionTimePickerProps> = (
  props: IQuestionTimePickerProps
) => {
  const { title, placeholder, format, use12Hours, disabled, onChange } = {
    ...QuestionTimePickerDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value

  const handleChange = (time: Dayjs | null, timeString: string) => {
    if (onChange) {
      // 答题模式：传递时间字符串
      ;(onChange as any)(timeString)
    }
  }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <div>
        <TimePicker
          value={externalValue}
          placeholder={placeholder}
          format={format}
          use12Hours={use12Hours}
          onChange={handleChange}
          disabled={disabled}
          className="w-full"
        />
      </div>
    </div>
  )
}

export default QuestionTimePicker

