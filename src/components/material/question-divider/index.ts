import QuestionDivider from './index.tsx'
import { QuestionDividerDefaultProps } from './interface.ts'
import dividerProps from './divider-props.tsx'

export * from './interface.ts'

export default {
  title: '分隔线',
  type: 'question-divider',
  PropComponent: dividerProps,
  component: QuestionDivider,
  defaultProps: QuestionDividerDefaultProps,
}

