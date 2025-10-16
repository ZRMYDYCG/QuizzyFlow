import QuestionQuote from './index.tsx'
import { QuestionQuoteDefaultProps } from './interface.ts'
import quoteProps from './quote-props.tsx'

export * from './interface.ts'

export default {
  title: '引用块',
  type: 'question-quote',
  PropComponent: quoteProps,
  component: QuestionQuote,
  defaultProps: QuestionQuoteDefaultProps,
}

