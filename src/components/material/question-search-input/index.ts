import QuestionSearchInput from './index.tsx'
import { QuestionSearchInputDefaultData } from './interface.ts'
import SearchInputProps from './search-input-props.tsx'

export * from './interface.ts'

export default {
  title: '搜索输入框',
  type: 'question-search-input',
  PropComponent: SearchInputProps,
  component: QuestionSearchInput,
  defaultProps: QuestionSearchInputDefaultData,
}

