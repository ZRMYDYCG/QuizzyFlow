import QuestionCode from './index.tsx'
import { QuestionCodeDefaultProps } from './interface.ts'
import codeProps from './code-props.tsx'

export * from './interface.ts'

export default {
  title: '代码块',
  type: 'question-code',
  PropComponent: codeProps,
  component: QuestionCode,
  defaultProps: QuestionCodeDefaultProps,
}

