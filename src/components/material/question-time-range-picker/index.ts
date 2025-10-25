import QuestionTimeRangePicker from './index.tsx'
import { QuestionTimeRangePickerDefaultData } from './interface.ts'
import TimeRangePickerProps from './time-range-picker-props.tsx'

export * from './interface.ts'

export default {
  title: '时间范围选择器',
  type: 'question-time-range-picker',
  PropComponent: TimeRangePickerProps,
  component: QuestionTimeRangePicker,
  defaultProps: QuestionTimeRangePickerDefaultData,
}

