export interface IconOptionType {
  value: string
  icon: string // antd icon 名称或 emoji
  label: string
}

export interface IQuestionIconSelectProps {
  title?: string
  options?: IconOptionType[]
  value?: string // 单选值
  values?: string[] // 多选值
  isMultiple?: boolean
  iconSize?: number // 图标大小

  disabled?: boolean
  onChange?: (newProps: IQuestionIconSelectProps) => void
}

export const QuestionIconSelectDefaultProps: IQuestionIconSelectProps = {
  title: '请选择您的兴趣爱好',
  isMultiple: true,
  iconSize: 48,
  value: '',
  values: [],
  options: [
    { value: 'music', icon: '🎵', label: '音乐' },
    { value: 'sports', icon: '⚽', label: '运动' },
    { value: 'reading', icon: '📚', label: '阅读' },
    { value: 'travel', icon: '✈️', label: '旅行' },
    { value: 'food', icon: '🍕', label: '美食' },
    { value: 'game', icon: '🎮', label: '游戏' },
    { value: 'movie', icon: '🎬', label: '电影' },
    { value: 'photography', icon: '📷', label: '摄影' },
  ],
}

export interface IIconSelectStatisticsProps {
  stat: Array<{ name: string; icon: string; count: number }>
}

