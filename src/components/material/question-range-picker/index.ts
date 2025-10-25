import QuestionRangePicker from './index.tsx'
import { QuestionRangePickerDefaultData } from './interface.ts'
import RangePickerProps from './range-picker-props.tsx'

export * from './interface.ts'

export default {
  title: '日期范围选择器',
  type: 'question-range-picker',
  PropComponent: RangePickerProps,
  component: QuestionRangePicker,
  defaultProps: QuestionRangePickerDefaultData,
}

