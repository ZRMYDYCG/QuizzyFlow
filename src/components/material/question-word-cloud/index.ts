import QuestionWordCloud from './index.tsx'
import { QuestionWordCloudDefaultProps } from './interface'
import WordCloudProps from './word-cloud-props.tsx'

export * from './interface'

export default {
  title: '词云选择',
  type: 'question-word-cloud',
  PropComponent: WordCloudProps,
  component: QuestionWordCloud,
  defaultProps: QuestionWordCloudDefaultProps,
}

