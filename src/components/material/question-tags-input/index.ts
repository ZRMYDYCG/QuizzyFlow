import QuestionTagsInput from './index.tsx'
import { QuestionTagsInputDefaultData } from './interface.ts'
import TagsInputProps from './tags-input-props.tsx'

export * from './interface.ts'

export default {
  title: '标签输入',
  type: 'question-tags-input',
  PropComponent: TagsInputProps,
  component: QuestionTagsInput,
  defaultProps: QuestionTagsInputDefaultData,
}

