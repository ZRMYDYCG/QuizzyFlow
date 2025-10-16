/**
 * @description 骨架屏组件
 */

import QuestionSkeleton from './index.tsx'
import SkeletonProps from './skeleton-props'
import { QuestionSkeletonDefaultProps } from './interface'

export * from './interface'

export default {
  title: '骨架屏',
  type: 'questionSkeleton',
  component: QuestionSkeleton,
  PropComponent: SkeletonProps,
  defaultProps: {
    ...QuestionSkeletonDefaultProps,
  },
}

