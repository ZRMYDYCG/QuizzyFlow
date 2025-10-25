/**
 * @description 提及输入组件
 * */
export interface MentionOption {
  value: string
  label: string
}

export interface IQuestionMentionsProps {
  // 提及输入标题
  title?: string
  // 提示信息
  placeholder?: string
  // 前缀触发字符
  prefix?: string | string[]
  // 可选项列表
  options?: MentionOption[]
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionMentionsProps) => void
}

export const QuestionMentionsDefaultData: IQuestionMentionsProps = {
  title: '@提及输入',
  placeholder: '输入 @ 提及用户',
  prefix: '@',
  options: [
    { value: 'user1', label: '用户1' },
    { value: 'user2', label: '用户2' },
    { value: 'user3', label: '用户3' },
  ],
  disabled: false,
}

