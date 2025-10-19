import QuestionComparison from './index.tsx'
import { QuestionComparisonDefaultProps } from './interface'
import ComparisonProps from './comparison-props.tsx'

export * from './interface'

export default {
  title: '对比选择',
  type: 'question-comparison',
  PropComponent: ComparisonProps,
  component: QuestionComparison,
  defaultProps: QuestionComparisonDefaultProps,
}

