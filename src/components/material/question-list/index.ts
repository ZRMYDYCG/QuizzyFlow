import QuestionList from './index.tsx'
import { QuestionListDefaultProps } from './interface.ts'
import listProps from './list-props.tsx'

export * from './interface.ts'

export default {
  title: '列表',
  type: 'question-list',
  PropComponent: listProps,
  component: QuestionList,
  defaultProps: QuestionListDefaultProps,
}

