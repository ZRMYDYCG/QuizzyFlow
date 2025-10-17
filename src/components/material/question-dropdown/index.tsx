import React from 'react'
import type { IQuestionDropdownProps } from './interface.ts'
import { QuestionDropdownDefaultData } from './interface.ts'
import { Dropdown, Button } from 'antd'
import type { MenuProps } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import * as Icons from '@ant-design/icons'

const QuestionDropdown: React.FC<IQuestionDropdownProps> = (
  props: IQuestionDropdownProps
) => {
  const { buttonText, menu, placement, trigger, disabled } = {
    ...QuestionDropdownDefaultData,
    ...props,
  }

  // 动态获取图标组件
  const getIcon = (iconName?: string) => {
    if (!iconName) return null
    const IconComponent = (Icons as any)[iconName]
    return IconComponent ? <IconComponent /> : null
  }

  // 转换为 Ant Design Menu 需要的格式
  const menuItems: MenuProps['items'] = menu?.map((item) => ({
    key: item.key,
    label: item.label,
    icon: getIcon(item.icon),
    disabled: item.disabled,
    danger: item.danger,
  }))

  // 处理菜单点击
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    console.log('Menu item clicked:', key)
  }

  return (
    <Dropdown
      menu={{ items: menuItems, onClick: handleMenuClick }}
      placement={placement}
      trigger={[trigger || 'hover']}
      disabled={disabled}
    >
      <Button>
        {buttonText} <DownOutlined />
      </Button>
    </Dropdown>
  )
}

export default QuestionDropdown

