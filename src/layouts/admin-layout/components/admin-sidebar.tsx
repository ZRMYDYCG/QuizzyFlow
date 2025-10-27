import React from 'react'
import { Layout, Menu } from 'antd'
import Logo from '@/components/Logo'
import { sideMenuItems } from '../config'
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
      }}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-700">
        <Logo showText={!collapsed} size="small" />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[currentPath]}
        items={sideMenuItems}
        onClick={handleMenuClick}
        className="border-r-0"
      />
    </Sider>
  )
}

export default AdminSidebar

