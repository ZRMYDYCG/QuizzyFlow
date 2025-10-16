import QuestionBadge from './index.tsx'
import { QuestionBadgeDefaultProps } from './interface.ts'
import badgeProps from './badge-props.tsx'

export * from './interface.ts'

export default {
  title: '徽章标签',
  type: 'question-badge',
  PropComponent: badgeProps,
  component: QuestionBadge,
  defaultProps: QuestionBadgeDefaultProps,
}

