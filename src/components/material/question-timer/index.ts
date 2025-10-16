import QuestionTimer from './index.tsx'
import { QuestionTimerDefaultProps } from './interface.ts'
import timerProps from './timer-props.tsx'

export * from './interface.ts'

export default {
  title: '计时器',
  type: 'question-timer',
  PropComponent: timerProps,
  component: QuestionTimer,
  defaultProps: QuestionTimerDefaultProps,
}