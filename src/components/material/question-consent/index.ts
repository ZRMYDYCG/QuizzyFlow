import QuestionConsent from './index.tsx'
import { QuestionConsentDefaultProps } from './interface'
import ConsentProps from './consent-props.tsx'

export * from './interface'

export default {
  title: '隐私同意',
  type: 'question-consent',
  PropComponent: ConsentProps,
  component: QuestionConsent,
  defaultProps: QuestionConsentDefaultProps,
}

