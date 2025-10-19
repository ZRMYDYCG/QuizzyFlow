import QuestionMultipageProgress from './index.tsx'
import { QuestionMultipageProgressDefaultProps } from './interface'
import MultipageProgressProps from './multipage-progress-props.tsx'

export * from './interface'

export default {
  title: '多页进度',
  type: 'question-multipage-progress',
  PropComponent: MultipageProgressProps,
  component: QuestionMultipageProgress,
  defaultProps: QuestionMultipageProgressDefaultProps,
}

