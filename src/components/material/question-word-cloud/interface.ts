export interface WordTagType {
  value: string
  text: string
  weight?: number // 权重，影响显示大小
  color?: string
}

export interface IQuestionWordCloudProps {
  title?: string
  tags?: WordTagType[]
  value?: string // 单选值
  values?: string[] // 多选值
  isMultiple?: boolean
  maxSelections?: number // 最多可选数量

  disabled?: boolean
  onChange?: (newProps: IQuestionWordCloudProps) => void
}

export const QuestionWordCloudDefaultProps: IQuestionWordCloudProps = {
  title: '请选择与您相关的标签',
  isMultiple: true,
  maxSelections: 5,
  value: '',
  values: [],
  tags: [
    { value: 'tech', text: '科技', weight: 5 },
    { value: 'music', text: '音乐', weight: 4 },
    { value: 'sports', text: '运动', weight: 3 },
    { value: 'travel', text: '旅行', weight: 5 },
    { value: 'food', text: '美食', weight: 4 },
    { value: 'reading', text: '阅读', weight: 2 },
    { value: 'movie', text: '电影', weight: 3 },
    { value: 'gaming', text: '游戏', weight: 4 },
    { value: 'photography', text: '摄影', weight: 2 },
    { value: 'art', text: '艺术', weight: 3 },
  ],
}

export interface IWordCloudStatisticsProps {
  stat: Array<{ name: string; count: number }>
}

