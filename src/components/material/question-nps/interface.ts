export interface IQuestionNPSProps {
  title?: string
  value?: number
  minLabel?: string // 最小值标签
  maxLabel?: string // 最大值标签
  showDescription?: boolean // 是否显示说明文字

  disabled?: boolean
  onChange?: (newProps: IQuestionNPSProps) => void
}

export const QuestionNPSDefaultProps: IQuestionNPSProps = {
  title: '您有多大可能向朋友或同事推荐我们的产品/服务？',
  value: undefined,
  minLabel: '完全不可能',
  maxLabel: '非常可能',
  showDescription: true,
}

export interface INPSStatisticsProps {
  stat: {
    promoters: number // 9-10分：推荐者
    passives: number // 7-8分：中立者
    detractors: number // 0-6分：贬损者
    npsScore: number // NPS分数
    distribution: number[] // 0-10分的分布
  }
}

