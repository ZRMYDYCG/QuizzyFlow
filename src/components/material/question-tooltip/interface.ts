/**
 * @description 文字提示组件
 * */
export interface IQuestionTooltipProps {
  // 基础属性
  title?: string // 提示文本
  text?: string // 触发文本
  placement?: 'top' | 'left' | 'right' | 'bottom'
  trigger?: 'hover' | 'click' | 'focus'
  color?: string // 背景色
  disabled?: boolean
  onChange?: (newProps: IQuestionTooltipProps) => void
}

export const QuestionTooltipDefaultData: IQuestionTooltipProps = {
  title: '这是一条提示信息',
  text: '鼠标移到这里',
  placement: 'top',
  trigger: 'hover',
  color: '',
  disabled: false,
}

