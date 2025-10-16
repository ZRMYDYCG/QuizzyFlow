import QuestionAudio from './index.tsx'
import { QuestionAudioDefaultProps } from './interface.ts'
import audioProps from './audio-props.tsx'

export * from './interface.ts'

export default {
  title: '音频',
  type: 'question-audio',
  PropComponent: audioProps,
  component: QuestionAudio,
  defaultProps: QuestionAudioDefaultProps,
}

