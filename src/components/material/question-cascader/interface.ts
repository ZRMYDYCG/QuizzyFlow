/**
 * @description 级联选择器组件
 * */
export interface ICascaderOption {
  value: string
  label: string
  children?: ICascaderOption[]
  disabled?: boolean
}

export interface IQuestionCascaderProps {
  // 基础属性
  placeholder?: string
  options?: ICascaderOption[]
  expandTrigger?: 'click' | 'hover'
  changeOnSelect?: boolean
  showSearch?: boolean
  multiple?: boolean
  disabled?: boolean
  onChange?: (newProps: IQuestionCascaderProps) => void
}

export const QuestionCascaderDefaultData: IQuestionCascaderProps = {
  placeholder: '请选择',
  options: [
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        { value: 'hangzhou', label: '杭州' },
        { value: 'ningbo', label: '宁波' },
      ],
    },
    {
      value: 'jiangsu',
      label: '江苏',
      children: [
        { value: 'nanjing', label: '南京' },
        { value: 'suzhou', label: '苏州' },
      ],
    },
  ],
  expandTrigger: 'click',
  changeOnSelect: false,
  showSearch: false,
  multiple: false,
  disabled: false,
}

