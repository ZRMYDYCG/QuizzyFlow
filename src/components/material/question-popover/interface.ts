/**
 * @description 气泡卡片组件
 * */
export interface IQuestionPopoverProps {
  // 基础属性
  title?: string
  content?: string
  trigger?: 'hover' | 'click' | 'focus'
  placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  buttonText?: string
  disabled?: boolean
  onChange?: (newProps: IQuestionPopoverProps) => void
}

export const QuestionPopoverDefaultData: IQuestionPopoverProps = {
  title: '卡片标题',
  content: '这里是卡片的详细内容信息',
  trigger: 'hover',
  placement: 'top',
  buttonText: '点击这里',
  disabled: false,
}

