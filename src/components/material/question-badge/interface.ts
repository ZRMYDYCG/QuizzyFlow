export interface IBadgeItem {
  text: string
  color?: string
  icon?: string
}

export interface IQuestionBadgeProps {
  badges?: IBadgeItem[]
  preset?: 'difficulty' | 'type' | 'custom'
  shape?: 'default' | 'round'
  size?: 'small' | 'default' | 'large'
  showIcon?: boolean
  onChange?: (newProps: IQuestionBadgeProps) => void
  disabled?: boolean
}

export const QuestionBadgeDefaultProps: IQuestionBadgeProps = {
  badges: [{ text: '标签', color: '#1890ff' }],
  preset: 'custom',
  shape: 'default',
  size: 'default',
  showIcon: false,
}

// 预设样式
export const DIFFICULTY_PRESETS = [
  { text: '简单', color: '#52c41a', icon: '😊' },
  { text: '中等', color: '#faad14', icon: '😐' },
  { text: '困难', color: '#ff4d4f', icon: '😰' },
]

export const TYPE_PRESETS = [
  { text: '必答', color: '#ff4d4f', icon: '⭐' },
  { text: '选答', color: '#1890ff', icon: '📝' },
  { text: '加分', color: '#52c41a', icon: '🎁' },
]

