/**
 * @description 菜单组件
 * */
export interface IMenuItem {
  key: string
  label: string
  icon?: string
  children?: IMenuItem[]
  disabled?: boolean
}

export interface IQuestionMenuProps {
  // 基础属性
  mode?: 'vertical' | 'horizontal' | 'inline'
  items?: IMenuItem[]
  theme?: 'light' | 'dark'
  selectedKeys?: string[]
  disabled?: boolean
  onChange?: (newProps: IQuestionMenuProps) => void
}

export const QuestionMenuDefaultData: IQuestionMenuProps = {
  mode: 'vertical',
  items: [
    {
      key: '1',
      label: '菜单项一',
      icon: 'HomeOutlined',
      disabled: false,
    },
    {
      key: '2',
      label: '菜单项二',
      icon: 'UserOutlined',
      disabled: false,
      children: [
        { key: '2-1', label: '子菜单 2-1', disabled: false },
        { key: '2-2', label: '子菜单 2-2', disabled: false },
      ],
    },
    {
      key: '3',
      label: '菜单项三',
      icon: 'SettingOutlined',
      disabled: false,
    },
  ],
  theme: 'light',
  selectedKeys: ['1'],
  disabled: false,
}

