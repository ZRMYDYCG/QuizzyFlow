import QuestionMenu from './index.tsx'
import MenuProps from './menu-props'
import { QuestionMenuDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '菜单',
  type: 'question-menu',
  // 编辑器组件
  PropComponent: MenuProps,
  // 画布显示的组件
  component: QuestionMenu,
  defaultProps: {
    ...QuestionMenuDefaultData,
  },
}

