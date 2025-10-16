export interface IQuestionProgressProps {
  percent?: number
  type?: 'line' | 'circle' | 'dashboard'
  status?: 'success' | 'exception' | 'normal' | 'active'
  strokeColor?: string
  showInfo?: boolean
  label?: string
  onChange?: (newProps: IQuestionProgressProps) => void
  disabled?: boolean
}

export const QuestionProgressDefaultProps: IQuestionProgressProps = {
  percent: 60,
  type: 'line',
  status: 'normal',
  strokeColor: '#1890ff',
  showInfo: true,
  label: '完成进度',
}

