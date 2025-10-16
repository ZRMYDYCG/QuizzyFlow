import { FC } from 'react'

export interface IQuestionEmptyProps {
  description?: string // 描述文字
  imageStyle?: 'default' | 'simple' // 图片样式
  showButton?: boolean // 显示按钮
  buttonText?: string // 按钮文字
  fe_id: string
  isLocked?: boolean
}

export const QuestionEmptyDefaultProps: IQuestionEmptyProps = {
  description: '暂无数据',
  imageStyle: 'default',
  showButton: false,
  buttonText: '立即创建',
  fe_id: '',
  isLocked: false,
}

export type PropsType = FC<IQuestionEmptyProps>

