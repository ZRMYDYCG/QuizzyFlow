export interface IQuestionMultipageProgressProps {
  title?: string
  totalPages?: number // 总页数
  currentPage?: number // 当前页
  showPercentage?: boolean // 是否显示百分比
  showPageNumber?: boolean // 是否显示页码
  progressType?: 'line' | 'circle' | 'steps' // 进度条类型

  disabled?: boolean
  onChange?: (newProps: IQuestionMultipageProgressProps) => void
}

export const QuestionMultipageProgressDefaultProps: IQuestionMultipageProgressProps = {
  title: '问卷进度',
  totalPages: 5,
  currentPage: 1,
  showPercentage: true,
  showPageNumber: true,
  progressType: 'line',
}

