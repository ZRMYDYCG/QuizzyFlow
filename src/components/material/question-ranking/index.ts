import QuestionRanking from './index.tsx'
import { QuestionRankingDefaultProps } from './interface'
import RankingProps from './ranking-props.tsx'

export * from './interface'

export default {
  title: '排序题',
  type: 'question-ranking',
  PropComponent: RankingProps,
  component: QuestionRanking,
  defaultProps: QuestionRankingDefaultProps,
}

