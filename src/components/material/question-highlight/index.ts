import QuestionHighlight from './index.tsx'
import { QuestionHighlightDefaultProps } from './interface.ts'
import highlightProps from './highlight-props.tsx'

export * from './interface.ts'

export default {
  title: '高亮文本',
  type: 'question-highlight',
  PropComponent: highlightProps,
  component: QuestionHighlight,
  defaultProps: QuestionHighlightDefaultProps,
}

