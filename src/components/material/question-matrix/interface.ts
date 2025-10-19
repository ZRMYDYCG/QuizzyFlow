export interface MatrixRowType {
  value: string
  text: string
}

export interface MatrixColumnType {
  value: string
  text: string
}

export interface IQuestionMatrixProps {
  title?: string
  rows?: MatrixRowType[]
  columns?: MatrixColumnType[]
  isMultiple?: boolean // 是否多选模式
  values?: Record<string, string | string[]> // 每行的选中值

  disabled?: boolean
  onChange?: (newProps: IQuestionMatrixProps) => void
}

export const QuestionMatrixDefaultProps: IQuestionMatrixProps = {
  title: '矩阵量表标题',
  isMultiple: false,
  rows: [
    { value: 'row1', text: '产品质量' },
    { value: 'row2', text: '服务态度' },
    { value: 'row3', text: '价格合理' },
  ],
  columns: [
    { value: 'col1', text: '非常满意' },
    { value: 'col2', text: '满意' },
    { value: 'col3', text: '一般' },
    { value: 'col4', text: '不满意' },
    { value: 'col5', text: '非常不满意' },
  ],
  values: {},
}

export interface IMatrixStatisticsProps {
  stat: Record<string, Record<string, number>>
}

