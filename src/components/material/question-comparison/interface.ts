export interface ComparisonOptionType {
  value: string
  title: string
  description?: string
  imageUrl?: string
  features?: string[]
}

export interface IQuestionComparisonProps {
  title?: string
  optionA?: ComparisonOptionType
  optionB?: ComparisonOptionType
  value?: string // 选择的值 'A' 或 'B'
  showImages?: boolean
  showFeatures?: boolean

  disabled?: boolean
  onChange?: (newProps: IQuestionComparisonProps) => void
}

export const QuestionComparisonDefaultProps: IQuestionComparisonProps = {
  title: '请选择您更喜欢的方案',
  showImages: true,
  showFeatures: true,
  value: '',
  optionA: {
    value: 'A',
    title: '方案 A',
    description: '经典设计方案',
    imageUrl: 'https://via.placeholder.com/400x300?text=Option+A',
    features: ['功能1', '功能2', '功能3'],
  },
  optionB: {
    value: 'B',
    title: '方案 B',
    description: '创新设计方案',
    imageUrl: 'https://via.placeholder.com/400x300?text=Option+B',
    features: ['特性1', '特性2', '特性3'],
  },
}

export interface IComparisonStatisticsProps {
  stat: {
    optionA: number
    optionB: number
    percentage: { A: number; B: number }
  }
}

