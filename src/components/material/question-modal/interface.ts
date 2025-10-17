/**
 * @description 对话框组件
 * */
export interface IQuestionModalProps {
  // 基础属性
  title?: string
  content?: string
  footer?: boolean
  width?: number
  centered?: boolean
  okText?: string
  cancelText?: string
  closable?: boolean
  disabled?: boolean
  onChange?: (newProps: IQuestionModalProps) => void
}

export const QuestionModalDefaultData: IQuestionModalProps = {
  title: '提示',
  content: '这里是对话框的内容',
  footer: true,
  width: 520,
  centered: false,
  okText: '确定',
  cancelText: '取消',
  closable: true,
  disabled: false,
}


