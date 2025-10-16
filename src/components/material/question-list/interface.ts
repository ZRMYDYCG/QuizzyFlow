export interface IQuestionListProps {
  items?: string
  listType?: 'ordered' | 'unordered'
  markerStyle?: 'number' | 'letter' | 'roman' | 'disc' | 'circle' | 'square' | 'arrow' | 'check'
  indent?: number
  itemSpacing?: 'compact' | 'normal' | 'relaxed'
  onChange?: (newProps: IQuestionListProps) => void
  disabled?: boolean
}

export const QuestionListDefaultProps: IQuestionListProps = {
  items: '列表项 1\n列表项 2\n列表项 3',
  listType: 'unordered',
  markerStyle: 'disc',
  indent: 1,
  itemSpacing: 'normal',
}

