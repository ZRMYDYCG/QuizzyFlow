import QuestionMarquee from './index.tsx'
import { QuestionMarqueeDefaultProps } from './interface.ts'
import marqueeProps from './marquee-props.tsx'

export * from './interface.ts'

export default {
  title: '滚动通知',
  type: 'question-marquee',
  PropComponent: marqueeProps,
  component: QuestionMarquee,
  defaultProps: QuestionMarqueeDefaultProps,
}

