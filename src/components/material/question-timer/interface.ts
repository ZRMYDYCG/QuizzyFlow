export interface IQuestionTimerProps {
  mode?: 'countdown' | 'stopwatch'
  duration?: number // 倒计时时长（秒）
  format?: 'HH:MM:SS' | 'MM:SS' | 'SS'
  showProgress?: boolean
  autoStart?: boolean
  title?: string
  warningTime?: number // 警告时间（秒）
  onChange?: (newProps: IQuestionTimerProps) => void
  disabled?: boolean
}

export const QuestionTimerDefaultProps: IQuestionTimerProps = {
  mode: 'countdown',
  duration: 300, // 5分钟
  format: 'MM:SS',
  showProgress: true,
  autoStart: false,
  title: '答题倒计时',
  warningTime: 60, // 最后1分钟警告
}

