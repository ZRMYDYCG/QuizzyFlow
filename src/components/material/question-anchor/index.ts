import QuestionAnchor from './index.tsx'
import AnchorProps from './anchor-props'
import { QuestionAnchorDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '锚点',
  type: 'question-anchor',
  // 编辑器组件
  PropComponent: AnchorProps,
  // 画布显示的组件
  component: QuestionAnchor,
  defaultProps: {
    ...QuestionAnchorDefaultData,
  },
}

