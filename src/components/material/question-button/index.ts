import QuestionButton from './index.tsx'
import ButtonProps from './button-props'
import { QuestionButtonDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '按钮',
  type: 'question-button',
  // 编辑器组件
  PropComponent: ButtonProps,
  // 画布显示的组件
  component: QuestionButton,
  defaultProps: {
    ...QuestionButtonDefaultData,
  },
}

