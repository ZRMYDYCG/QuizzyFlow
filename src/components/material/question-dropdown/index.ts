import QuestionDropdown from './index.tsx'
import DropdownProps from './dropdown-props'
import { QuestionDropdownDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '下拉菜单',
  type: 'question-dropdown',
  // 编辑器组件
  PropComponent: DropdownProps,
  // 画布显示的组件
  component: QuestionDropdown,
  defaultProps: {
    ...QuestionDropdownDefaultData,
  },
}

