import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  FileTextOutlined,
  SettingOutlined,
  ProfileOutlined,
} from '@ant-design/icons'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import AdminHeader from '../admin-header'
import NotificationDrawer from '../notification-drawer'
import TabNav from '../tab-nav'
import PageTransition from '../page-transition'
import { useTabNav } from '../../hooks/useTabNav'
import { sideMenuItems } from '../../config'

const { Content } = Layout

const iconMenuItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined style={{ fontSize: 20 }} /> },
  { key: '/admin/users', icon: <UserOutlined style={{ fontSize: 20 }} /> },
  { key: '/admin/roles', icon: <TeamOutlined style={{ fontSize: 20 }} /> },
  { key: '/admin/permissions', icon: <SafetyOutlined style={{ fontSize: 20 }} /> },
  { key: '/admin/questions', icon: <FileTextOutlined style={{ fontSize: 20 }} /> },
  { key: '/admin/logs', icon: <ProfileOutlined style={{ fontSize: 20 }} /> },
  { key: '/admin/settings', icon: <SettingOutlined style={{ fontSize: 20 }} /> },
]

/**
 * 双列布局 - 左侧图标列 + 子菜单列 + 内容区
 * 
 * 布局结构：
 * ┌──┬─────────┬──────────────────┐
 * │  │         │    Header        │
 * │I │ Submenu ├──────────────────┤
 * │c │         │    Content       │
 * │o │         │                  │
 * │n │         │                  │
 * └──┴─────────┴──────────────────┘
 */
const ColumnsLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useTheme()
  const { config } = useLayoutConfig()
  const [selectedMenu, setSelectedMenu] = useState('/admin/dashboard')
  const [notificationVisible, setNotificationVisible] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // 标签页导航
  const {
    tabs,
    handleTabClick,
    handleTabClose,
    handleCloseOthers,
    handleCloseAll,
    handleCloseLeft,
    handleCloseRight,
  } = useTabNav(location.pathname)

  const handleMenuClick = (key: string) => {
    navigate(key)
  }

  const handleIconClick = (key: string) => {
    setSelectedMenu(key)
    navigate(key)
  }

  const handleToggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Layout className={`min-h-screen ${theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-gray-50'}`}>
      <div className="flex h-screen">
        {/* 左侧图标栏 */}
        <div
          className={`
            ${theme === 'dark' ? 'bg-[#141418] border-white/5' : 'bg-gray-900 border-gray-200'} 
            w-16 flex-shrink-0 flex flex-col items-center py-4 border-r
          `}
        >
          {iconMenuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleIconClick(item.key)}
              className={`
                w-12 h-12 rounded-lg flex items-center justify-center mb-2 transition-all
                ${
                  selectedMenu === item.key
                    ? 'bg-blue-500 text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              {item.icon}
            </button>
          ))}
        </div>

        {/* 子菜单栏 */}
        <div
          className={`
            ${theme === 'dark' ? 'bg-[#1e1e23]' : 'bg-white'} 
            ${collapsed ? 'w-0' : 'w-48'}
            flex-shrink-0 border-r transition-all duration-200 overflow-hidden
            ${theme === 'dark' ? 'border-white/5' : 'border-gray-200'}
          `}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => handleMenuClick(key)}
            items={sideMenuItems}
            className={theme === 'dark' ? 'bg-[#1e1e23]' : 'bg-white'}
            style={{ borderRight: 0, height: '100%' }}
          />
        </div>

        {/* 主内容区 */}
        <Layout className={theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-gray-50'}>
          {/* 顶部导航 */}
          <AdminHeader
            collapsed={collapsed}
            onToggleCollapsed={handleToggleCollapsed}
            onNotificationClick={() => setNotificationVisible(true)}
            notificationCount={5}
          />

          {/* 内容区域 */}
          <Content
            className="mx-6 my-6"
            style={{
              marginTop: 80,
              minHeight: 'calc(100vh - 112px)',
            }}
          >
            {config.showTabs && (
              <TabNav
                currentPath={location.pathname}
                tabs={tabs}
                onTabClick={handleTabClick}
                onTabClose={handleTabClose}
                onCloseOthers={handleCloseOthers}
                onCloseAll={handleCloseAll}
                onCloseLeft={handleCloseLeft}
                onCloseRight={handleCloseRight}
              />
            )}

            <div
              className={`
                ${theme === 'dark' ? 'bg-[#1e1e23] text-slate-300' : 'bg-white text-gray-700'} 
                rounded-lg p-6 min-h-full transition-colors
                ${config.boxStyle === 'border' ? 'border border-gray-200 dark:border-gray-700' : 'shadow-sm'}
              `}
            >
              <PageTransition>
                <Outlet />
              </PageTransition>
            </div>
          </Content>
        </Layout>
      </div>

      <NotificationDrawer
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />
    </Layout>
  )
}

export default ColumnsLayout

