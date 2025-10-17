import React from 'react'
import type { IQuestionMenuProps, IMenuItem } from './interface.ts'
import { QuestionMenuDefaultData } from './interface.ts'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import * as Icons from '@ant-design/icons'

const QuestionMenu: React.FC<IQuestionMenuProps> = (
  props: IQuestionMenuProps
) => {
  const { mode, items, theme, selectedKeys, disabled } = {
    ...QuestionMenuDefaultData,
    ...props,
  }

  // 动态获取图标组件
  const getIcon = (iconName?: string) => {
    if (!iconName) return null
    const IconComponent = (Icons as any)[iconName]
    return IconComponent ? <IconComponent /> : null
  }

  // 递归转换菜单项为 Ant Design Menu 需要的格式
  const convertMenuItems = (menuItems?: IMenuItem[]): MenuProps['items'] => {
    return menuItems?.map((item) => ({
      key: item.key,
      label: item.label,
      icon: getIcon(item.icon),
      disabled: item.disabled,
      children: item.children ? convertMenuItems(item.children) : undefined,
    }))
  }

  // 处理菜单点击
  const handleClick: MenuProps['onClick'] = ({ key }) => {
    console.log('Menu item clicked:', key)
  }

  return (
    <Menu
      mode={mode}
      theme={theme}
      selectedKeys={selectedKeys}
      items={convertMenuItems(items)}
      onClick={handleClick}
      style={{ width: mode === 'horizontal' ? '100%' : 256 }}
      disabled={disabled}
    />
  )
}

export default QuestionMenu

