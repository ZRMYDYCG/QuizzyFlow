/**
 * @description 按钮组件
 * */
export interface IQuestionButtonProps {
  // 基础属性
  text?: string
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
  size?: 'large' | 'middle' | 'small'
  disabled?: boolean
  loading?: boolean
  icon?: string
  shape?: 'default' | 'circle' | 'round'
  danger?: boolean
  block?: boolean
  onClick?: string // 点击事件（跳转链接或自定义脚本）
  onChange?: (newProps: IQuestionButtonProps) => void
}

export const QuestionButtonDefaultData: IQuestionButtonProps = {
  text: '按钮',
  type: 'default',
  size: 'middle',
  disabled: false,
  loading: false,
  icon: '',
  shape: 'default',
  danger: false,
  block: false,
  onClick: '',
}

