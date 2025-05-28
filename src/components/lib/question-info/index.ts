import QuestionInfo from './index.tsx'
import { QuestionDefaultProps } from './interface.ts'
import InfoProps from './info-props.tsx'

export * from './interface.ts'

export default {
  title: '输入框',
  type: 'question-info',
  PropComponent: InfoProps,
  component: QuestionInfo,
  defaultProps: QuestionDefaultProps,
}
