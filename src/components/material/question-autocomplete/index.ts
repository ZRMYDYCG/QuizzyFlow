import QuestionAutocomplete from './index.tsx'
import AutocompleteProps from './autocomplete-props'
import { QuestionAutocompleteDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '自动完成',
  type: 'question-autocomplete',
  // 编辑器组件
  PropComponent: AutocompleteProps,
  // 画布显示的组件
  component: QuestionAutocomplete,
  defaultProps: {
    ...QuestionAutocompleteDefaultData,
  },
}

