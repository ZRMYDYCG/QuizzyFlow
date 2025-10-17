import QuestionDrawer from './index.tsx'
import DrawerProps from './drawer-props'
import { QuestionDrawerDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '抽屉',
  type: 'question-drawer',
  // 编辑器组件
  PropComponent: DrawerProps,
  // 画布显示的组件
  component: QuestionDrawer,
  defaultProps: {
    ...QuestionDrawerDefaultData,
  },
}


