import QuestionUrlInput from './index.tsx'
import { QuestionUrlInputDefaultData } from './interface.ts'
import UrlInputProps from './url-input-props.tsx'

export * from './interface.ts'

export default {
  title: 'URL输入框',
  type: 'question-url-input',
  PropComponent: UrlInputProps,
  component: QuestionUrlInput,
  defaultProps: QuestionUrlInputDefaultData,
}

