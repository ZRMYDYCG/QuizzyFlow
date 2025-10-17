/**
 * @description 下拉菜单组件
 * */
export interface IDropdownMenuItem {
  key: string
  label: string
  icon?: string
  disabled?: boolean
  danger?: boolean
}

export interface IQuestionDropdownProps {
  // 基础属性
  buttonText?: string
  menu?: IDropdownMenuItem[]
  placement?: 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight'
  trigger?: 'click' | 'hover'
  disabled?: boolean
  onChange?: (newProps: IQuestionDropdownProps) => void
}

export const QuestionDropdownDefaultData: IQuestionDropdownProps = {
  buttonText: '下拉菜单',
  menu: [
    { key: '1', label: '选项一', icon: '', disabled: false, danger: false },
    { key: '2', label: '选项二', icon: '', disabled: false, danger: false },
    { key: '3', label: '选项三', icon: '', disabled: false, danger: false },
  ],
  placement: 'bottomLeft',
  trigger: 'hover',
  disabled: false,
}

