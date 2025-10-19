import QuestionEmojiPicker from './index.tsx'
import { QuestionEmojiPickerDefaultProps } from './interface'
import EmojiPickerProps from './emoji-picker-props.tsx'

export * from './interface'

export default {
  title: '表情选择器',
  type: 'question-emoji-picker',
  PropComponent: EmojiPickerProps,
  component: QuestionEmojiPicker,
  defaultProps: QuestionEmojiPickerDefaultProps,
}

