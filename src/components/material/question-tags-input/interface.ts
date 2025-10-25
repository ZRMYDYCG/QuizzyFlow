/**
 * @description 标签输入组件
 * */
export interface IQuestionTagsInputProps {
  // 标签输入标题
  title?: string
  // 提示信息
  placeholder?: string
  // 最大标签数量
  maxTags?: number
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionTagsInputProps) => void
}

export const QuestionTagsInputDefaultData: IQuestionTagsInputProps = {
  title: '标签输入',
  placeholder: '请输入标签后按回车',
  maxTags: 10,
  disabled: false,
}

