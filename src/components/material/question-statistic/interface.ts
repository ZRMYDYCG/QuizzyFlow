import { FC } from 'react'

export interface IQuestionStatisticProps {
  title?: string // 标题
  value: number // 数值
  prefix?: string // 前缀
  suffix?: string // 后缀
  precision?: number // 精度（小数位）
  groupSeparator?: string // 千分位分隔符
  valueStyle?: 'default' | 'success' | 'warning' | 'danger' // 数值样式
  fe_id: string
  isLocked?: boolean
}

export const QuestionStatisticDefaultProps: IQuestionStatisticProps = {
  title: '在线用户',
  value: 128936,
  suffix: '人',
  precision: 0,
  groupSeparator: ',',
  valueStyle: 'default',
  fe_id: '',
  isLocked: false,
}

export type PropsType = FC<IQuestionStatisticProps>

