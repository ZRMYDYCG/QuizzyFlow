import QuestionMentionTextarea from './index.tsx'
import { QuestionMentionTextareaDefaultData } from './interface.ts'
import MentionTextareaProps from './mention-textarea-props.tsx'

export * from './interface.ts'

export default {
  title: '提及文本域',
  type: 'question-mention-textarea',
  PropComponent: MentionTextareaProps,
  component: QuestionMentionTextarea,
  defaultProps: QuestionMentionTextareaDefaultData,
}

