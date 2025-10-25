/**
 * @description 数字输入框组件
 * */
export interface IQuestionNumberInputProps {
  // 数字输入框标题
  title?: string
  // 提示信息
  placeholder?: string
  // 最小值
  min?: number
  // 最大值
  max?: number
  // 步长
  step?: number
  // 精度（小数点位数）
  precision?: number
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionNumberInputProps) => void
}

export const QuestionNumberInputDefaultData: IQuestionNumberInputProps = {
  title: '数字输入',
  placeholder: '请输入数字',
  min: 0,
  max: 100,
  step: 1,
  precision: 0,
  disabled: false,
}

