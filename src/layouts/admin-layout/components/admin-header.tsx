import React from 'react'
import { Layout } from 'antd'
import { Bell, PanelLeft, PanelLeftClose } from 'lucide-react'
import UserDropdown from './user-dropdown'
import ThemeToggle from '@/components/ThemeToggle'
import AdminBreadcrumb from './admin-breadcrumb'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { useNavigate } from 'react-router-dom'
import { useLogout } from '@/hooks/useLogout'
import { useTheme } from '@/contexts/ThemeContext'
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
  const { theme, primaryColor } = useTheme()

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <Header
      className={`
        ${theme === 'dark' ? 'bg-[#1a1a1f] border-white/5' : 'bg-white border-gray-200'} 
        shadow-sm px-4 md:px-6 flex items-center justify-between fixed z-10 border-b
      `}
      style={{
        left: collapsed ? 80 : 240,
        right: 0,
        transition: 'all 0.2s',
      }}
    >
      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
        {/* 折叠/展开按钮 */}
        <button
          onClick={onToggleCollapsed}
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center hover:text-white transition-colors flex-shrink-0
            ${theme === 'dark' ? 'bg-[#2a2a2f] hover:bg-[#35353a] text-slate-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}
          `}
          title={collapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {collapsed ? (
            <PanelLeft className="w-4 h-4" strokeWidth={2} />
          ) : (
            <PanelLeftClose className="w-4 h-4" strokeWidth={2} />
          )}
        </button>
        
        {/* 面包屑导航 */}
        <AdminBreadcrumb />
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* 通知按钮 */}
        <button
          onClick={onNotificationClick}
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center hover:text-white transition-colors
            ${notificationCount > 0 ? 'relative' : ''}
            ${theme === 'dark' ? 'bg-[#2a2a2f] hover:bg-[#35353a] text-slate-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}
          `}
          title="通知"
        >
          <Bell className="w-4 h-4" strokeWidth={2} />
          {notificationCount > 0 && (
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full shadow-lg"
              style={{ backgroundColor: primaryColor }}
            />
          )}
        </button>

        {/* 主题切换按钮 */}
        <ThemeToggle />

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

