import QuestionTooltip from './index.tsx'
import TooltipProps from './tooltip-props'
import { QuestionTooltipDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '文字提示',
  type: 'question-tooltip',
  // 编辑器组件
  PropComponent: TooltipProps,
  // 画布显示的组件
  component: QuestionTooltip,
  defaultProps: {
    ...QuestionTooltipDefaultData,
  },
}

