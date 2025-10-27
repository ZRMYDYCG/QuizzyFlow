import React from 'react'
import { Layout, Button, Badge } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from '@ant-design/icons'
import UserDropdown from './user-dropdown'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { useNavigate } from 'react-router-dom'
import { useLogout } from '@/hooks/useLogout'
import type { AdminHeaderProps } from '../types'

const { Header } = Layout

/**
 * 管理后台顶部导航栏
 */
const AdminHeader: React.FC<AdminHeaderProps> = ({
  collapsed,
  onToggleCollapsed,
  onNotificationClick,
  notificationCount = 0,
}) => {
  const navigate = useNavigate()
  const { username, nickname, avatar } = useGetUserInfo()
  const { logout } = useLogout()

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <Header
      className="bg-white shadow-sm px-6 flex items-center justify-between fixed z-10"
      style={{
        left: collapsed ? 80 : 240,
        right: 0,
        transition: 'all 0.2s',
      }}
    >
      <div className="flex items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapsed}
          className="text-lg"
        />
        <div className="ml-4 text-gray-600">管理后台</div>
      </div>

      <div className="flex items-center gap-4">
        {/* 通知 */}
        <Badge count={notificationCount} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            onClick={onNotificationClick}
            className="text-lg"
          />
        </Badge>

        {/* 用户菜单 */}
        <UserDropdown
          username={username}
          nickname={nickname}
          avatar={avatar}
          onNavigate={handleNavigate}
          onLogout={logout}
        />
      </div>
    </Header>
  )
}

export default AdminHeader

