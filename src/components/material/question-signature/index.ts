import QuestionSignature from './index.tsx'
import { QuestionSignatureDefaultProps } from './interface'
import SignatureProps from './signature-props.tsx'

export * from './interface'

export default {
  title: '电子签名',
  type: 'question-signature',
  PropComponent: SignatureProps,
  component: QuestionSignature,
  defaultProps: QuestionSignatureDefaultProps,
}

