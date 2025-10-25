/**
 * @description 搜索输入框组件
 * */
export interface IQuestionSearchInputProps {
  // 搜索输入框标题
  title?: string
  // 提示信息
  placeholder?: string
  // 搜索按钮文字
  enterButton?: string | boolean
  // 输入框大小
  size?: 'large' | 'middle' | 'small'
  // 是否禁用
  disabled?: boolean
  // 是否允许清除
  allowClear?: boolean
  onChange?: (value: IQuestionSearchInputProps) => void
}

export const QuestionSearchInputDefaultData: IQuestionSearchInputProps = {
  title: '搜索输入',
  placeholder: '请输入搜索内容',
  enterButton: '搜索',
  size: 'middle',
  disabled: false,
  allowClear: true,
}

