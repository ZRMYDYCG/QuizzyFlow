import QuestionTable from './index.tsx'
import { QuestionTableDefaultProps } from './interface.ts'
import tableProps from './table-props.tsx'

export * from './interface.ts'

export default {
  title: '表格',
  type: 'question-table',
  PropComponent: tableProps,
  component: QuestionTable,
  defaultProps: QuestionTableDefaultProps,
}

