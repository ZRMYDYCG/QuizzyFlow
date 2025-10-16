import { FC } from 'react'

export interface IDescriptionItem {
  label: string
  content: string
}

export interface IQuestionDescriptionsProps {
  title?: string // 标题
  items: IDescriptionItem[] // 描述项
  column?: 1 | 2 | 3 // 列数
  bordered?: boolean // 边框
  size?: 'default' | 'middle' | 'small' // 尺寸
  layout?: 'horizontal' | 'vertical' // 布局
  fe_id: string
  isLocked?: boolean
}

export const QuestionDescriptionsDefaultProps: IQuestionDescriptionsProps = {
  title: '用户信息',
  items: [
    { label: '姓名', content: '张三' },
    { label: '手机号', content: '138****8888' },
    { label: '邮箱', content: 'zhangsan@example.com' },
    { label: '地址', content: '北京市朝阳区' },
    { label: '创建时间', content: '2024-01-01 10:00:00' },
    { label: '备注', content: '这是一段备注信息' },
  ],
  column: 2,
  bordered: true,
  size: 'default',
  layout: 'horizontal',
  fe_id: '',
  isLocked: false,
}

export type PropsType = FC<IQuestionDescriptionsProps>

