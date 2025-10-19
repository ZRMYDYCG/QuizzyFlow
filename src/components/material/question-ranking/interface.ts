export interface RankingOptionType {
  value: string
  text: string
  order?: number
}

export interface IQuestionRankingProps {
  title?: string
  options?: RankingOptionType[]
  showNumbers?: boolean // 是否显示序号
  description?: string // 说明文字

  disabled?: boolean
  onChange?: (newProps: IQuestionRankingProps) => void
}

export const QuestionRankingDefaultProps: IQuestionRankingProps = {
  title: '请按重要性排序以下选项',
  showNumbers: true,
  description: '拖动选项可调整排序',
  options: [
    { value: 'opt1', text: '选项1', order: 1 },
    { value: 'opt2', text: '选项2', order: 2 },
    { value: 'opt3', text: '选项3', order: 3 },
    { value: 'opt4', text: '选项4', order: 4 },
  ],
}

export interface IRankingStatisticsProps {
  stat: Array<{
    name: string
    averageRank: number
    rankDistribution: Record<number, number>
  }>
}

