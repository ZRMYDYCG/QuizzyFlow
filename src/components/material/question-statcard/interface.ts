import { FC } from 'react'

export interface IQuestionStatCardProps {
  title: string // 标题
  value: number | string // 数值
  prefix?: string // 前缀（如 ￥）
  suffix?: string // 后缀（如 %、次）
  subtitle?: string // 副标题
  trend?: 'up' | 'down' | 'none' // 趋势
  trendValue?: string // 趋势值
  color?: string // 主题色
  fe_id: string
  isLocked?: boolean
}

export const QuestionStatCardDefaultProps: IQuestionStatCardProps = {
  title: '总访问量',
  value: 8846,
  suffix: '次',
  subtitle: '今日访问',
  trend: 'up',
  trendValue: '+12.5%',
  color: '#1890ff',
  fe_id: '',
  isLocked: false,
}

export type PropsType = FC<IQuestionStatCardProps>

