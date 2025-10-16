/**
 * @description 卡片网格组件
 */

import QuestionCardGrid from './index.tsx'
import CardGridProps from './cardgrid-props'
import { QuestionCardGridDefaultProps } from './interface'

export * from './interface'

export default {
  title: '卡片网格',
  type: 'questionCardGrid',
  component: QuestionCardGrid,
  PropComponent: CardGridProps,
  defaultProps: {
    ...QuestionCardGridDefaultProps,
  },
}

