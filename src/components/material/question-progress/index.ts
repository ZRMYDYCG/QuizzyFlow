import QuestionProgress from './index.tsx'
import { QuestionProgressDefaultProps } from './interface.ts'
import progressProps from './progress-props.tsx'

export * from './interface.ts'

export default {
  title: '进度条',
  type: 'question-progress',
  PropComponent: progressProps,
  component: QuestionProgress,
  defaultProps: QuestionProgressDefaultProps,
}

