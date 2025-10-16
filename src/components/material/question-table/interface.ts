export interface ITableColumn {
  title: string
  dataIndex?: string
}

export interface ITableRow {
  key?: string
  [key: string]: any
}

export interface IQuestionTableProps {
  columns?: ITableColumn[]
  dataSource?: ITableRow[]
  bordered?: boolean
  striped?: boolean
  showHeader?: boolean
  size?: 'small' | 'middle' | 'large'
  onChange?: (newProps: IQuestionTableProps) => void
  disabled?: boolean
}

export const QuestionTableDefaultProps: IQuestionTableProps = {
  columns: [
    { title: '列1', dataIndex: 'col1' },
    { title: '列2', dataIndex: 'col2' },
    { title: '列3', dataIndex: 'col3' },
  ],
  dataSource: [
    { key: '1', col1: '数据1-1', col2: '数据1-2', col3: '数据1-3' },
    { key: '2', col1: '数据2-1', col2: '数据2-2', col3: '数据2-3' },
  ],
  bordered: true,
  striped: false,
  showHeader: true,
  size: 'middle',
}

