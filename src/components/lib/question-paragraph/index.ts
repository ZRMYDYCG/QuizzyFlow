import QuestionParagraph from './index.tsx'
import { QuestionParagraphDefaultProps } from './interface.ts'
import paragraphProps from './paragraph-props.tsx'

export * from './interface.ts'

export default {
  title: '段落',
  type: 'question-paragraph',
  PropComponent: paragraphProps,
  component: QuestionParagraph,
  defaultProps: QuestionParagraphDefaultProps,
}
