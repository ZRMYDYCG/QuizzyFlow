import QuestionRangeSlider from './index.tsx'
import { QuestionRangeSliderDefaultData } from './interface.ts'
import RangeSliderProps from './range-slider-props.tsx'

export * from './interface.ts'

export default {
  title: '区间滑块',
  type: 'question-range-slider',
  PropComponent: RangeSliderProps,
  component: QuestionRangeSlider,
  defaultProps: QuestionRangeSliderDefaultData,
}

