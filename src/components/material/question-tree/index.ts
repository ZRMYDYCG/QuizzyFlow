/**
 * @description 树形组件
 */

import QuestionTree from './index.tsx'
import TreeProps from './tree-props'
import { QuestionTreeDefaultProps } from './interface'

export * from './interface'

export default {
  title: '树形结构',
  type: 'questionTree',
  component: QuestionTree,
  PropComponent: TreeProps,
  defaultProps: {
    ...QuestionTreeDefaultProps,
  },
}

