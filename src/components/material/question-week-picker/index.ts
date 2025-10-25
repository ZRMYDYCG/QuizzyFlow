import QuestionWeekPicker from './index.tsx'
import { QuestionWeekPickerDefaultData } from './interface.ts'
import WeekPickerProps from './week-picker-props.tsx'

export * from './interface.ts'

export default {
  title: '周选择器',
  type: 'question-week-picker',
  PropComponent: WeekPickerProps,
  component: QuestionWeekPicker,
  defaultProps: QuestionWeekPickerDefaultData,
}

