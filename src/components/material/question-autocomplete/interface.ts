/**
 * @description 自动完成组件
 * */
export interface IAutocompleteOption {
  value: string
  label: string
}

export interface IQuestionAutocompleteProps {
  // 基础属性
  placeholder?: string
  options?: IAutocompleteOption[]
  filterOption?: boolean
  disabled?: boolean
  allowClear?: boolean
  onChange?: (newProps: IQuestionAutocompleteProps) => void
}

export const QuestionAutocompleteDefaultData: IQuestionAutocompleteProps = {
  placeholder: '请输入',
  options: [
    { value: 'option1', label: '选项一' },
    { value: 'option2', label: '选项二' },
    { value: 'option3', label: '选项三' },
    { value: 'option4', label: '选项四' },
    { value: 'option5', label: '选项五' },
  ],
  filterOption: true,
  disabled: false,
  allowClear: true,
}

