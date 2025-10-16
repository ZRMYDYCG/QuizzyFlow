import { FC } from 'react'

export interface ICardItem {
  title: string
  description: string
  image?: string
}

export interface IQuestionCardGridProps {
  items: ICardItem[] // 卡片数据
  columns?: 2 | 3 | 4 // 列数
  hoverable?: boolean // 悬浮效果
  bordered?: boolean // 边框
  fe_id: string
  isLocked?: boolean
}

export const QuestionCardGridDefaultProps: IQuestionCardGridProps = {
  items: [
    { 
      title: 'React 教程', 
      description: '学习现代化的 React 开发',
      image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
    },
    { 
      title: 'Vue 教程', 
      description: '渐进式 JavaScript 框架',
      image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
    },
    { 
      title: 'TypeScript', 
      description: 'JavaScript 的超集',
      image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
    },
  ],
  columns: 3,
  hoverable: true,
  bordered: true,
  fe_id: '',
  isLocked: false,
}

export type PropsType = FC<IQuestionCardGridProps>

