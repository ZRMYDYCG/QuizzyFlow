/**
 * @description 提及文本域组件
 * */
export interface MentionOption {
  value: string
  label: string
}

export interface IQuestionMentionTextareaProps {
  // 提及文本域标题
  title?: string
  // 提示信息
  placeholder?: string
  // 行数
  rows?: number
  // 前缀触发字符
  prefix?: string | string[]
  // 可选项列表
  options?: MentionOption[]
  // 最大长度
  maxLength?: number
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionMentionTextareaProps) => void
}

export const QuestionMentionTextareaDefaultData: IQuestionMentionTextareaProps = {
  title: '提及文本输入',
  placeholder: '输入 @ 提及用户，# 提及话题',
  rows: 4,
  prefix: ['@', '#'],
  options: [
    { value: 'user1', label: '@用户1' },
    { value: 'user2', label: '@用户2' },
    { value: 'topic1', label: '#话题1' },
    { value: 'topic2', label: '#话题2' },
  ],
  maxLength: 500,
  disabled: false,
}

