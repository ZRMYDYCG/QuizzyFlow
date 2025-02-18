import QuestionRadio from './index.tsx'
import { QuestionRadioDefaultProps } from './interface.ts'
import RadioProps from './radio-props.tsx'
import StatisticsComponents from './stat-component.tsx'

export * from './interface.ts'

export default {
  title: '单选',
  type: 'question-radio',
  PropComponent: RadioProps,
  component: QuestionRadio,
  defaultProps: QuestionRadioDefaultProps,
  statisticsComponent: StatisticsComponents,
}
