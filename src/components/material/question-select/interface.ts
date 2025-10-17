/**
 * @description 选择器组件
 * */
export interface ISelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface IQuestionSelectProps {
  // 基础属性
  placeholder?: string
  options?: ISelectOption[]
  mode?: 'default' | 'multiple' | 'tags'
  allowClear?: boolean
  showSearch?: boolean
  disabled?: boolean
  size?: 'large' | 'middle' | 'small'
  maxTagCount?: number
  onChange?: (newProps: IQuestionSelectProps) => void
}

export const QuestionSelectDefaultData: IQuestionSelectProps = {
  placeholder: '请选择',
  options: [
    { value: '1', label: '选项一', disabled: false },
    { value: '2', label: '选项二', disabled: false },
    { value: '3', label: '选项三', disabled: false },
  ],
  mode: 'default',
  allowClear: true,
  showSearch: false,
  disabled: false,
  size: 'middle',
  maxTagCount: 3,
}

