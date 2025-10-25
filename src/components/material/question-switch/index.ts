import QuestionSwitch from './index.tsx'
import { QuestionSwitchDefaultData } from './interface.ts'
import SwitchProps from './switch-props.tsx'

export * from './interface.ts'

export default {
  title: '开关',
  type: 'question-switch',
  PropComponent: SwitchProps,
  component: QuestionSwitch,
  defaultProps: QuestionSwitchDefaultData,
}

