import QuestionTreeSelect from './index.tsx'
import { QuestionTreeSelectDefaultData } from './interface.ts'
import TreeSelectProps from './tree-select-props.tsx'

export * from './interface.ts'

export default {
  title: '树形选择',
  type: 'question-tree-select',
  PropComponent: TreeSelectProps,
  component: QuestionTreeSelect,
  defaultProps: QuestionTreeSelectDefaultData,
}

