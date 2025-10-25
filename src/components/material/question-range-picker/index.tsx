import React from 'react'
import { DatePicker, Typography } from 'antd'
import type { Dayjs } from 'dayjs'
import * as dayjsLib from 'dayjs'
import { IQuestionRangePickerProps, QuestionRangePickerDefaultData } from './interface.ts'

const dayjs = (dayjsLib as any).default || dayjsLib

const { RangePicker } = DatePicker

const QuestionRangePicker: React.FC<IQuestionRangePickerProps> = (
  props: IQuestionRangePickerProps
) => {
  const { title, placeholder, format, showTime, disabled, onChange } = {
    ...QuestionRangePickerDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value
  
  // 将字符串数组转换为 Dayjs 对象数组
  let dayjsValue: [Dayjs, Dayjs] | null = null
  if (externalValue && Array.isArray(externalValue) && externalValue.length === 2) {
    const [start, end] = externalValue
    if (start && end) {
      dayjsValue = [dayjs(start), dayjs(end)]
    }
  }

  const handleChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (onChange) {
      // 答题模式：传递日期字符串数组
      ;(onChange as any)(dateStrings)
    }
  }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <div>
        <RangePicker
          value={dayjsValue}
          placeholder={placeholder}
          format={format}
          showTime={showTime}
          onChange={handleChange}
          disabled={disabled}
          className="w-full"
        />
      </div>
    </div>
  )
}

export default QuestionRangePicker

