import { FC } from 'react'

export interface IQuestionSkeletonProps {
  active?: boolean // 动画效果
  avatar?: boolean // 显示头像
  paragraph?: boolean // 显示段落
  rows?: number // 段落行数
  showTitle?: boolean // 显示标题（改名避免与其他组件的 title: string 冲突）
  round?: boolean // 圆角
  fe_id: string
  isLocked?: boolean
}

export const QuestionSkeletonDefaultProps: IQuestionSkeletonProps = {
  active: true,
  avatar: true,
  paragraph: true,
  rows: 3,
  showTitle: true,
  round: false,
  fe_id: '',
  isLocked: false,
}

export type PropsType = FC<IQuestionSkeletonProps>

