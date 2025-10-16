import { FC } from 'react'
import { DatePicker, TimePicker, Space, Typography } from 'antd'
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
  } = {
    ...QuestionDateDefaultProps,
    ...props,
  }

  const renderPicker = () => {
    switch (mode) {
      case 'time':
        return <TimePicker format="HH:mm:ss" placeholder={placeholder} style={{ width: '100%', maxWidth: 300 }} />
      case 'datetime':
        return <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={placeholder} style={{ width: '100%', maxWidth: 300 }} />
      case 'range':
        return <RangePicker showTime={showTime} format={format} style={{ width: '100%', maxWidth: 400 }} />
      default:
        return <DatePicker format={format} placeholder={placeholder} style={{ width: '100%', maxWidth: 300 }} />
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

