import QuestionSlider from './index.tsx'
import { QuestionSliderDefaultProps } from './interface.ts'
import sliderProps from './slider-props.tsx'

export * from './interface.ts'

export default {
  title: '滑块',
  type: 'question-slider',
  PropComponent: sliderProps,
  component: QuestionSlider,
  defaultProps: QuestionSliderDefaultProps,
}

