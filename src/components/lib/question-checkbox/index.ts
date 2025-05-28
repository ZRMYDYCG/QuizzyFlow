import QuestionCheckbox from './index.tsx'
import { QuestionCheckboxDefaultProps } from './interface.ts'
import CheckboxProps from './checkbox-props.tsx'
import StatisticsComponents from './stat-component.tsx'

export * from './interface.ts'

export default {
  title: '输入框',
  type: 'question-checkbox',
  PropComponent: CheckboxProps,
  component: QuestionCheckbox,
  defaultProps: QuestionCheckboxDefaultProps,
  statisticsComponent: StatisticsComponents,
}
