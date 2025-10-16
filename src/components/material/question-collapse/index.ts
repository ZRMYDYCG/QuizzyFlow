import QuestionCollapse from './index.tsx'
import { QuestionCollapseDefaultProps } from './interface.ts'
import collapseProps from './collapse-props.tsx'

export * from './interface.ts'

export default {
  title: '折叠面板',
  type: 'question-collapse',
  PropComponent: collapseProps,
  component: QuestionCollapse,
  defaultProps: QuestionCollapseDefaultProps,
}

