export interface IQuestionAudioProps {
  src?: string
  autoplay?: boolean
  loop?: boolean
  controls?: boolean
  volume?: number
  onChange?: (newProps: IQuestionAudioProps) => void
  disabled?: boolean
}

export const QuestionAudioDefaultProps: IQuestionAudioProps = {
  src: '',
  autoplay: false,
  loop: false,
  controls: true,
  volume: 80,
}

