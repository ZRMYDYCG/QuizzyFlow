/**
 * @description 统计数字组件
 */

import QuestionStatistic from './index.tsx'
import StatisticProps from './statistic-props'
import { QuestionStatisticDefaultProps } from './interface'

export * from './interface'

export default {
  title: '统计数字',
  type: 'questionStatistic',
  component: QuestionStatistic,
  PropComponent: StatisticProps,
  defaultProps: {
    ...QuestionStatisticDefaultProps,
  },
}

