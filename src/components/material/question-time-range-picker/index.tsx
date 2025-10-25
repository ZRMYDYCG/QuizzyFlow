import React from 'react'
import { TimePicker, Typography } from 'antd'
import type { Dayjs } from 'dayjs'
import { IQuestionTimeRangePickerProps, QuestionTimeRangePickerDefaultData } from './interface.ts'

const { RangePicker } = TimePicker

const QuestionTimeRangePicker: React.FC<IQuestionTimeRangePickerProps> = (
  props: IQuestionTimeRangePickerProps
) => {
  const { title, placeholder, format, use12Hours, disabled, onChange } = {
    ...QuestionTimeRangePickerDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value

  const handleChange = (
    times: [Dayjs | null, Dayjs | null] | null,
    timeStrings: [string, string]
  ) => {
    if (onChange) {
      // 答题模式：传递时间字符串数组
      ;(onChange as any)(timeStrings)
    }
  }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <div>
        <RangePicker
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

export default QuestionTimeRangePicker

