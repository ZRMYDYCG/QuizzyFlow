import QuestionYearPicker from './index.tsx'
import { QuestionYearPickerDefaultData } from './interface.ts'
import YearPickerProps from './year-picker-props.tsx'

export * from './interface.ts'

export default {
  title: '年份选择器',
  type: 'question-year-picker',
  PropComponent: YearPickerProps,
  component: QuestionYearPicker,
  defaultProps: QuestionYearPickerDefaultData,
}

