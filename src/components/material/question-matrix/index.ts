import QuestionMatrix from './index.tsx'
import { QuestionMatrixDefaultProps } from './interface'
import MatrixProps from './matrix-props.tsx'

export * from './interface'

export default {
  title: '矩阵量表',
  type: 'question-matrix',
  PropComponent: MatrixProps,
  component: QuestionMatrix,
  defaultProps: QuestionMatrixDefaultProps,
}

