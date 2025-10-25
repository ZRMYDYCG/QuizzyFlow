import QuestionTimePicker from './index.tsx'
import { QuestionTimePickerDefaultData } from './interface.ts'
import TimePickerProps from './time-picker-props.tsx'

export * from './interface.ts'

export default {
  title: '时间选择器',
  type: 'question-time-picker',
  PropComponent: TimePickerProps,
  component: QuestionTimePicker,
  defaultProps: QuestionTimePickerDefaultData,
}

