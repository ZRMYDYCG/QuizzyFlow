import { FC } from 'react'

export interface IQuestionResultProps {
  status: 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500' // 状态
  title: string // 标题
  subTitle?: string // 副标题
  showButton?: boolean // 显示按钮
  buttonText?: string // 按钮文字
  fe_id: string
  isLocked?: boolean
}

export const QuestionResultDefaultProps: IQuestionResultProps = {
  status: 'success',
  title: '提交成功',
  subTitle: '您的问卷已成功提交，感谢您的参与！',
  showButton: true,
  buttonText: '返回首页',
  fe_id: '',
  isLocked: false,
}

export type PropsType = FC<IQuestionResultProps>

