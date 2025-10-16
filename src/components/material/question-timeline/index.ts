/**
 * @description 时间轴组件
 */

import QuestionTimeline from './index.tsx'
import TimelineProps from './timeline-props'
import { QuestionTimelineDefaultProps } from './interface'

export * from './interface'

export default {
  title: '时间轴',
  type: 'questionTimeline',
  component: QuestionTimeline,
  PropComponent: TimelineProps,
  defaultProps: {
    ...QuestionTimelineDefaultProps,
  },
}

