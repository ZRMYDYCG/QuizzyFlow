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
  /** 动画类型 */
  animateType?: 'none' | 'shake' | 'float'
  /** 打字机效果配置 */
  typewriter?: {
    isOpen: boolean
    config: {
      speed: number // 打字速度(ms/字符)
      cursor: string // 光标字符
      isInfinite: boolean // 是否无限循环
      loopCount: number // 循环次数（仅当非无限时有效）
    }
  }
}

export const QuestionTitleDefaultData: IQuestionTitleProps = {
  text: '定义标题',
  level: 1,
  isCenter: false,
  color: '#000000',
  animateType: 'none',
  typewriter: {
    isOpen: false,
    config: {
      speed: 50,
      cursor: '⎟',
      isInfinite: false,
      loopCount: 1,
    },
  },
}
