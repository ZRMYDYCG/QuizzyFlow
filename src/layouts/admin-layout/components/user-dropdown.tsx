import React from 'react'
import { Dropdown, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { getUserMenuItems } from '../config'
import type { UserDropdownProps } from '../types'

/**
 * 用户下拉菜单组件
 */
const UserDropdown: React.FC<UserDropdownProps> = ({
  username,
  nickname,
  avatar,
  onNavigate,
  onLogout,
}) => {
  const menuItems = getUserMenuItems(onNavigate, onLogout)

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
      <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded">
        <Avatar src={avatar} icon={<UserOutlined />} size="small" />
        <span className="text-sm font-medium">{nickname || username}</span>
      </div>
    </Dropdown>
  )
}

export default UserDropdown

