import QuestionSegmented from './index.tsx'
import { QuestionSegmentedDefaultData } from './interface.ts'
import SegmentedProps from './segmented-props.tsx'

export * from './interface.ts'

export default {
  title: '分段控制器',
  type: 'question-segmented',
  PropComponent: SegmentedProps,
  component: QuestionSegmented,
  defaultProps: QuestionSegmentedDefaultData,
}

