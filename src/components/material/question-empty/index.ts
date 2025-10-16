/**
 * @description 空状态组件
 */

import QuestionEmpty from './index.tsx'
import EmptyProps from './empty-props'
import { QuestionEmptyDefaultProps } from './interface'

export * from './interface'

export default {
  title: '空状态',
  type: 'questionEmpty',
  component: QuestionEmpty,
  PropComponent: EmptyProps,
  defaultProps: {
    ...QuestionEmptyDefaultProps,
  },
}

