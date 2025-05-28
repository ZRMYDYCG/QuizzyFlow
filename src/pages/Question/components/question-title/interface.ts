/**
 * @description 标题组件
 * */
export interface IQuestionTitleProps {
  // 基础属性
  text?: string
  level?: 1 | 2 | 3 | 4 | 5
  isCenter?: boolean
  disabled?: boolean
  onChange?: (newProps: IQuestionTitleProps) => void
  color?: string
  /** 动画（| 'shake' | 'float' | 'none'） */
  animateType?: string
}

export const QuestionTitleDefaultData: IQuestionTitleProps = {
  text: '定义标题',
  level: 1,
  isCenter: false,
  color: '#000000',
  animateType: 'none',
}
