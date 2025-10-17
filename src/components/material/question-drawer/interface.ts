/**
 * @description 抽屉组件
 * */
export interface IQuestionDrawerProps {
  // 基础属性
  title?: string
  content?: string
  placement?: 'top' | 'right' | 'bottom' | 'left'
  width?: number | string
  height?: number | string
  closable?: boolean
  mask?: boolean
  maskClosable?: boolean
  disabled?: boolean
  onChange?: (newProps: IQuestionDrawerProps) => void
}

export const QuestionDrawerDefaultData: IQuestionDrawerProps = {
  title: '详情',
  content: '这里是抽屉的内容',
  placement: 'right',
  width: 378,
  height: 256,
  closable: true,
  mask: true,
  maskClosable: true,
  disabled: false,
}


