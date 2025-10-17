/**
 * @description 链接组件
 * */
export interface IQuestionLinkProps {
  // 基础属性
  text?: string
  href?: string
  target?: '_blank' | '_self'
  underline?: boolean
  disabled?: boolean
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  onChange?: (newProps: IQuestionLinkProps) => void
}

export const QuestionLinkDefaultData: IQuestionLinkProps = {
  text: '链接文本',
  href: 'https://example.com',
  target: '_blank',
  underline: true,
  disabled: false,
  type: 'default',
}

