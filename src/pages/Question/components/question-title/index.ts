import QuestionTitle from './index.tsx'
import TitleProps from './title-props.tsx'
import { QuestionTitleDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '标题',
  type: 'question-title',
  PropComponent: TitleProps, // 编辑器组件
  component: QuestionTitle, // 画布显示的组件
  defaultProps: QuestionTitleDefaultData,
}
