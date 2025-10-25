import React from 'react'
import { DatePicker, Typography } from 'antd'
import type { Dayjs } from 'dayjs'
import * as dayjsLib from 'dayjs'
import { IQuestionWeekPickerProps, QuestionWeekPickerDefaultData } from './interface.ts'

const dayjs = (dayjsLib as any).default || dayjsLib

const QuestionWeekPicker: React.FC<IQuestionWeekPickerProps> = (
  props: IQuestionWeekPickerProps
) => {
  const { title, placeholder, format, disabled, onChange } = {
    ...QuestionWeekPickerDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value
  
  // 将字符串转换为 Dayjs 对象
  const dayjsValue = externalValue ? dayjs(externalValue) : null

  const handleChange = (date: Dayjs | null, dateString: string | string[]) => {
    if (onChange) {
      // 答题模式：传递日期字符串
      ;(onChange as any)(dateString)
    }
  }

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <div>
        <DatePicker
          value={dayjsValue}
          placeholder={placeholder}
          picker="week"
          format={format}
          onChange={handleChange}
          disabled={disabled}
          className="w-full"
        />
      </div>
    </div>
  )
}

export default QuestionWeekPicker

