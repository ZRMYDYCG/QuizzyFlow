import QuestionIconSelect from './index.tsx'
import { QuestionIconSelectDefaultProps } from './interface'
import IconSelectProps from './icon-select-props.tsx'

export * from './interface'

export default {
  title: '图标选择',
  type: 'question-icon-select',
  PropComponent: IconSelectProps,
  component: QuestionIconSelect,
  defaultProps: QuestionIconSelectDefaultProps,
}

