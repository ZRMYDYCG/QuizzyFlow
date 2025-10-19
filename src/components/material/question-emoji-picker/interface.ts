export interface EmojiOptionType {
  value: string
  emoji: string
  label: string
}

export interface IQuestionEmojiPickerProps {
  title?: string
  options?: EmojiOptionType[]
  value?: string
  size?: 'small' | 'medium' | 'large'
  allowMultiple?: boolean // 是否允许多选
  values?: string[] // 多选时的值

  disabled?: boolean
  onChange?: (newProps: IQuestionEmojiPickerProps) => void
}

export const QuestionEmojiPickerDefaultProps: IQuestionEmojiPickerProps = {
  title: '请选择您的感受',
  size: 'medium',
  allowMultiple: false,
  value: '',
  values: [],
  options: [
    { value: 'very-happy', emoji: '😍', label: '非常开心' },
    { value: 'happy', emoji: '😊', label: '开心' },
    { value: 'neutral', emoji: '😐', label: '一般' },
    { value: 'sad', emoji: '😢', label: '难过' },
    { value: 'angry', emoji: '😡', label: '生气' },
  ],
}

export interface IEmojiStatisticsProps {
  stat: Array<{ name: string; emoji: string; count: number }>
}

