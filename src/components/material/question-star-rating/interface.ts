export interface IQuestionStarRatingProps {
  title?: string
  count?: number // 星星数量
  value?: number // 当前评分
  allowHalf?: boolean // 是否允许半星
  allowClear?: boolean // 是否允许清除
  showValue?: boolean // 是否显示分值
  descriptions?: string[] // 每个等级的描述

  disabled?: boolean
  onChange?: (newProps: IQuestionStarRatingProps) => void
}

export const QuestionStarRatingDefaultProps: IQuestionStarRatingProps = {
  title: '请为我们评分',
  count: 5,
  value: 0,
  allowHalf: true,
  allowClear: true,
  showValue: true,
  descriptions: ['很差', '较差', '一般', '满意', '非常满意'],
}

export interface IStarRatingStatisticsProps {
  stat: {
    average: number
    distribution: Record<number, number>
  }
}

