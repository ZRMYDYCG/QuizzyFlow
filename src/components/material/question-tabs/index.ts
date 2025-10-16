/**
 * @description 标签页组件
 */

import QuestionTabs from './index.tsx'
import TabsProps from './tabs-props'
import { QuestionTabsDefaultProps } from './interface'

export * from './interface'

export default {
  title: '标签页',
  type: 'questionTabs',
  component: QuestionTabs,
  PropComponent: TabsProps,
  defaultProps: {
    ...QuestionTabsDefaultProps,
  },
}

