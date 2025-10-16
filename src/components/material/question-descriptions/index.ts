/**
 * @description 描述列表组件
 */

import QuestionDescriptions from './index.tsx'
import DescriptionsProps from './descriptions-props'
import { QuestionDescriptionsDefaultProps } from './interface'

export * from './interface'

export default {
  title: '描述列表',
  type: 'questionDescriptions',
  component: QuestionDescriptions,
  PropComponent: DescriptionsProps,
  defaultProps: {
    ...QuestionDescriptionsDefaultProps,
  },
}

