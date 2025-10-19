import QuestionStarRating from './index.tsx'
import { QuestionStarRatingDefaultProps } from './interface'
import StarRatingProps from './star-rating-props.tsx'

export * from './interface'

export default {
  title: '星级评分',
  type: 'question-star-rating',
  PropComponent: StarRatingProps,
  component: QuestionStarRating,
  defaultProps: QuestionStarRatingDefaultProps,
}

