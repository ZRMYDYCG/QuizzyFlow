import QuestionSpin from './index.tsx'
import SpinProps from './spin-props'
import { QuestionSpinDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '加载中',
  type: 'question-spin',
  // 编辑器组件
  PropComponent: SpinProps,
  // 画布显示的组件
  component: QuestionSpin,
  defaultProps: {
    ...QuestionSpinDefaultData,
  },
}

