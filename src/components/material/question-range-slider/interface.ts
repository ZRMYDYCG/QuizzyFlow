/**
 * @description 区间滑块组件
 * */
export interface IQuestionRangeSliderProps {
  // 区间滑块标题
  title?: string
  // 最小值
  min?: number
  // 最大值
  max?: number
  // 步长
  step?: number
  // 是否显示刻度
  marks?: boolean
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionRangeSliderProps) => void
}

export const QuestionRangeSliderDefaultData: IQuestionRangeSliderProps = {
  title: '区间选择',
  min: 0,
  max: 100,
  step: 1,
  marks: false,
  disabled: false,
}

