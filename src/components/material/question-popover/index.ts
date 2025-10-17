import QuestionPopover from './index.tsx'
import PopoverProps from './popover-props'
import { QuestionPopoverDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '气泡卡片',
  type: 'question-popover',
  // 编辑器组件
  PropComponent: PopoverProps,
  // 画布显示的组件
  component: QuestionPopover,
  defaultProps: {
    ...QuestionPopoverDefaultData,
  },
}

