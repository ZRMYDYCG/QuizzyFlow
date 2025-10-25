import { FC } from 'react'
import { DatePicker, TimePicker, Space, Typography } from 'antd'
import type { Dayjs } from 'dayjs'
import {
  IQuestionDateProps,
  QuestionDateDefaultProps,
} from './interface.ts'

const { Text } = Typography
const { RangePicker } = DatePicker

const QuestionDate: FC<IQuestionDateProps> = (
  props: IQuestionDateProps
) => {
  const {
    mode = 'date',
    format = 'YYYY-MM-DD',
    label = '请选择日期',
    placeholder = '请选择',
    showTime = false,
    onChange,
  } = {
    ...QuestionDateDefaultProps,
    ...props,
  }

  // 获取外部传入的 value（答题模式）- 直接使用 Dayjs 对象
  const externalValue = (props as any).value

  const handleChange = (value: any) => {
    if (onChange) {
      // 直接传递 Dayjs 对象或数组，由提交时统一处理格式化
      ;(onChange as any)(value)
    }
  }

  const renderPicker = () => {
    switch (mode) {
      case 'time':
        return (
          <TimePicker 
            format="HH:mm:ss" 
            placeholder={placeholder} 
            value={externalValue as Dayjs}
            onChange={handleChange}
            style={{ width: '100%', maxWidth: 300 }} 
          />
        )
      case 'datetime':
        return (
          <DatePicker 
            showTime 
            format="YYYY-MM-DD HH:mm:ss" 
            placeholder={placeholder}
            value={externalValue as Dayjs}
            onChange={handleChange}
            style={{ width: '100%', maxWidth: 300 }} 
          />
        )
      case 'range':
        return (
          <RangePicker 
            showTime={showTime} 
            format={format}
            value={externalValue as [Dayjs, Dayjs]}
            onChange={handleChange as any}
            style={{ width: '100%', maxWidth: 400 }} 
          />
        )
      default:
        return (
          <DatePicker 
            format={format} 
            placeholder={placeholder}
            value={externalValue as Dayjs}
            onChange={handleChange}
            style={{ width: '100%', maxWidth: 300 }} 
          />
        )
    }
  }

  return (
    <Space direction="vertical" size={8} style={{ width: '100%' }}>
      {label && <Text>{label}</Text>}
      <div style={{ width: '100%' }}>
        {renderPicker()}
      </div>
    </Space>
  )
}

export default QuestionDate

