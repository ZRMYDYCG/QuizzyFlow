import QuestionLink from './index.tsx'
import LinkProps from './link-props'
import { QuestionLinkDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '链接',
  type: 'question-link',
  // 编辑器组件
  PropComponent: LinkProps,
  // 画布显示的组件
  component: QuestionLink,
  defaultProps: {
    ...QuestionLinkDefaultData,
  },
}

