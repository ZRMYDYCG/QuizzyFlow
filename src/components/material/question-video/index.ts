import QuestionVideo from './index.tsx'
import { QuestionVideoDefaultProps } from './interface.ts'
import videoProps from './video-props.tsx'

export * from './interface.ts'

export default {
  title: '视频',
  type: 'question-video',
  PropComponent: videoProps,
  component: QuestionVideo,
  defaultProps: QuestionVideoDefaultProps,
}

