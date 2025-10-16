/**
 * @description 统计卡片组件
 */

import QuestionStatCard from './index.tsx'
import StatCardProps from './statcard-props'
import { QuestionStatCardDefaultProps } from './interface'

export * from './interface'

export default {
  title: '统计卡片',
  type: 'questionStatCard',
  component: QuestionStatCard,
  PropComponent: StatCardProps,
  defaultProps: {
    ...QuestionStatCardDefaultProps,
  },
}

