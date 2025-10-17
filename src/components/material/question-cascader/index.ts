import QuestionCascader from './index.tsx'
import CascaderProps from './cascader-props'
import { QuestionCascaderDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '级联选择',
  type: 'question-cascader',
  // 编辑器组件
  PropComponent: CascaderProps,
  // 画布显示的组件
  component: QuestionCascader,
  defaultProps: {
    ...QuestionCascaderDefaultData,
  },
}

