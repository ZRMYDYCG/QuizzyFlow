import { FC } from 'react'

export interface ITabItem {
  label: string
  key: string
  children: string
}

export interface IQuestionTabsProps {
  items: ITabItem[] // 标签页数据
  defaultActiveKey?: string // 默认激活
  tabPosition?: 'top' | 'right' | 'bottom' | 'left' // 位置
  size?: 'large' | 'middle' | 'small' // 尺寸
  type?: 'line' | 'card' // 类型
  fe_id: string
  isLocked?: boolean
}

export const QuestionTabsDefaultProps: IQuestionTabsProps = {
  items: [
    { label: '选项卡1', key: '1', children: '这是选项卡1的内容' },
    { label: '选项卡2', key: '2', children: '这是选项卡2的内容' },
    { label: '选项卡3', key: '3', children: '这是选项卡3的内容' },
  ],
  defaultActiveKey: '1',
  tabPosition: 'top',
  size: 'middle',
  type: 'line',
  fe_id: '',
  isLocked: false,
}

export type PropsType = FC<IQuestionTabsProps>

