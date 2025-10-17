/**
 * @description 加载中组件
 * */
export interface IQuestionSpinProps {
  // 基础属性
  size?: 'small' | 'default' | 'large'
  tip?: string
  spinning?: boolean
  delay?: number
  disabled?: boolean
  onChange?: (newProps: IQuestionSpinProps) => void
}

export const QuestionSpinDefaultData: IQuestionSpinProps = {
  size: 'default',
  tip: '加载中...',
  spinning: true,
  delay: 0,
  disabled: false,
}

