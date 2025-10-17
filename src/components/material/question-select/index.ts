import QuestionSelect from './index.tsx'
import SelectProps from './select-props'
import { QuestionSelectDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '选择器',
  type: 'question-select',
  // 编辑器组件
  PropComponent: SelectProps,
  // 画布显示的组件
  component: QuestionSelect,
  defaultProps: {
    ...QuestionSelectDefaultData,
  },
}

