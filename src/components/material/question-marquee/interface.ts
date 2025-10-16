export interface IMarqueeMessage {
  id: string
  text: string
}

export interface IQuestionMarqueeProps {
  messages?: IMarqueeMessage[]
  direction?: 'horizontal' | 'vertical'
  speed?: number // 滚动速度 (1-10)
  pauseOnHover?: boolean
  loop?: boolean
  backgroundColor?: string
  textColor?: string
  showIcon?: boolean
  onChange?: (newProps: IQuestionMarqueeProps) => void
  disabled?: boolean
}

export const QuestionMarqueeDefaultProps: IQuestionMarqueeProps = {
  messages: [{ id: '1', text: '欢迎参加本次问卷调查！' }],
  direction: 'horizontal',
  speed: 5,
  pauseOnHover: true,
  loop: true,
  backgroundColor: '#e6f7ff',
  textColor: '#1890ff',
  showIcon: true,
}

