import QuestionMonthPicker from './index.tsx'
import { QuestionMonthPickerDefaultData } from './interface.ts'
import MonthPickerProps from './month-picker-props.tsx'

export * from './interface.ts'

export default {
  title: '月份选择器',
  type: 'question-month-picker',
  PropComponent: MonthPickerProps,
  component: QuestionMonthPicker,
  defaultProps: QuestionMonthPickerDefaultData,
}

