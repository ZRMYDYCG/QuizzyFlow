import QuestionTitle from './index.tsx'
import TitleProps from './title-props.tsx'
import { QuestionTitleDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '标题',
  type: 'question-title',
  // 编辑器组件
  PropComponent: TitleProps,
  // 画布显示的组件
  component: QuestionTitle,
  defaultProps: {
    ...QuestionTitleDefaultData,
  },
}
