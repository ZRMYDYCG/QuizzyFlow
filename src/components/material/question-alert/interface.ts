export interface IQuestionAlertProps {
  message?: string
  description?: string
  type?: 'success' | 'info' | 'warning' | 'error'
  showIcon?: boolean
  closable?: boolean
  bordered?: boolean
  onChange?: (newProps: IQuestionAlertProps) => void
  disabled?: boolean
}

export const QuestionAlertDefaultProps: IQuestionAlertProps = {
  message: '提示信息',
  description: '',
  type: 'info',
  showIcon: true,
  closable: false,
  bordered: true,
}

