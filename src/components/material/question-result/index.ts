/**
 * @description 结果组件
 */

import QuestionResult from './index.tsx'
import ResultProps from './result-props'
import { QuestionResultDefaultProps } from './interface'

export * from './interface'

export default {
  title: '结果页',
  type: 'questionResult',
  component: QuestionResult,
  PropComponent: ResultProps,
  defaultProps: {
    ...QuestionResultDefaultProps,
  },
}

