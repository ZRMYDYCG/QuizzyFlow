/**
 * @description 开关组件
 * */
export interface IQuestionSwitchProps {
  // 开关标题
  title?: string
  // 是否默认选中
  defaultChecked?: boolean
  // 选中时的文字
  checkedText?: string
  // 未选中时的文字
  unCheckedText?: string
  // 是否禁用
  disabled?: boolean
  // 是否加载中
  loading?: boolean
  onChange?: (value: IQuestionSwitchProps) => void
}

export const QuestionSwitchDefaultData: IQuestionSwitchProps = {
  title: '开关选择',
  defaultChecked: false,
  checkedText: '开',
  unCheckedText: '关',
  disabled: false,
  loading: false,
}

