import React from 'react'
import { Layout, Menu } from 'antd'
import Logo from '@/components/Logo'
import { useTheme } from '@/contexts/ThemeContext'
import { sideMenuItems } from '../config'
import { useAdminMenu } from '@/hooks/useAdminMenu'
import type { AdminSidebarProps } from '../types'

const { Sider } = Layout

/**
 * 管理后台侧边栏
 */
const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  currentPath,
  onMenuClick,
}) => {
  const { theme } = useTheme()
  const filteredMenuItems = useAdminMenu(sideMenuItems)

  const handleMenuClick = ({ key }: { key: string }) => {
    onMenuClick(key)
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      className="shadow-lg"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme === 'dark' ? '#001529' : '#ffffff',
      }}
    >
      <div className={`h-16 flex items-center justify-center border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <Logo showText={!collapsed} size="small" />
      </div>
      <Menu
        theme={theme === 'dark' ? 'dark' : 'light'}
        mode="inline"
        selectedKeys={[currentPath]}
        items={filteredMenuItems}
        onClick={handleMenuClick}
        className="border-r-0"
      />
    </Sider>
  )
}

export default AdminSidebar

