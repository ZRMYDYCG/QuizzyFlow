import QuestionAlert from './index.tsx'
import { QuestionAlertDefaultProps } from './interface.ts'
import alertProps from './alert-props.tsx'

export * from './interface.ts'

export default {
  title: '提示卡片',
  type: 'question-alert',
  PropComponent: alertProps,
  component: QuestionAlert,
  defaultProps: QuestionAlertDefaultProps,
}

