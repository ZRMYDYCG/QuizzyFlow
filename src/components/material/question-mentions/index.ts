import QuestionMentions from './index.tsx'
import { QuestionMentionsDefaultData } from './interface.ts'
import MentionsProps from './mentions-props.tsx'

export * from './interface.ts'

export default {
  title: '@提及输入',
  type: 'question-mentions',
  PropComponent: MentionsProps,
  component: QuestionMentions,
  defaultProps: QuestionMentionsDefaultData,
}

