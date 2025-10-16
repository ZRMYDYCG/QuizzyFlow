import { FC } from 'react'

export interface ITimelineItem {
  label?: string // 时间标签
  children: string // 内容
  color?: string // 颜色
  dot?: string // 图标（可选）
}

export interface IQuestionTimelineProps {
  items: ITimelineItem[] // 时间线项
  mode?: 'left' | 'right' | 'alternate' // 布局模式
  pending?: boolean // 是否显示待办
  reverse?: boolean // 倒序
  fe_id: string
  isLocked?: boolean
}

export const QuestionTimelineDefaultProps: IQuestionTimelineProps = {
  items: [
    { label: '2024-01', children: '项目启动', color: 'green' },
    { label: '2024-03', children: '需求分析完成', color: 'blue' },
    { label: '2024-06', children: '开发阶段', color: 'gray' },
    { label: '2024-09', children: '测试上线', color: 'red' },
  ],
  mode: 'left',
  pending: false,
  reverse: false,
  fe_id: '',
  isLocked: false,
}

export type PropsType = FC<IQuestionTimelineProps>

