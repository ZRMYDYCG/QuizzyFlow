import QuestionSteps from './index.tsx'
import { QuestionStepsDefaultProps } from './interface.ts'
import stepsProps from './steps-props.tsx'

export * from './interface.ts'

export default {
  title: '步骤条',
  type: 'question-steps',
  PropComponent: stepsProps,
  component: QuestionSteps,
  defaultProps: QuestionStepsDefaultProps,
}

