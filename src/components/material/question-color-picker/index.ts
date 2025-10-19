import QuestionColorPicker from './index.tsx'
import { QuestionColorPickerDefaultProps } from './interface'
import ColorPickerProps from './color-picker-props.tsx'

export * from './interface'

export default {
  title: '颜色选择器',
  type: 'question-color-picker',
  PropComponent: ColorPickerProps,
  component: QuestionColorPicker,
  defaultProps: QuestionColorPickerDefaultProps,
}

