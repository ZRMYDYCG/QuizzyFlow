export interface IQuestionVideoProps {
  src?: string
  width?: number
  height?: number
  autoplay?: boolean
  loop?: boolean
  controls?: boolean
  muted?: boolean
  poster?: string
  onChange?: (newProps: IQuestionVideoProps) => void
  disabled?: boolean
}

export const QuestionVideoDefaultProps: IQuestionVideoProps = {
  src: '',
  width: 640,
  height: 360,
  autoplay: false,
  loop: false,
  controls: true,
  muted: false,
  poster: '',
}

