import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout } from 'antd'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import AdminSidebar from '../admin-sidebar'
import AdminHeader from '../admin-header'
import NotificationDrawer from '../notification-drawer'
import TabNav from '../tab-nav'
import PageTransition from '../page-transition'
import { useTabNav } from '../../hooks/useTabNav'

const { Content } = Layout

/**
 * 垂直布局 - 左侧侧边栏 + 右侧内容区
 * 
 * 布局结构：
 * ┌─────────┬──────────────────┐
 * │         │    Header        │
 * │ Sidebar ├──────────────────┤
 * │         │    Content       │
 * │         │                  │
 * └─────────┴──────────────────┘
 */
const VerticalLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useTheme()
  const { config } = useLayoutConfig()
  const [collapsed, setCollapsed] = useState(config.sidebarCollapsed)
  const [notificationVisible, setNotificationVisible] = useState(false)

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

  // 处理侧边栏菜单点击
  const handleMenuClick = (key: string) => {
    navigate(key)
  }

  // 切换侧边栏折叠状态
  const handleToggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  // 打开通知抽屉
  const handleNotificationClick = () => {
    setNotificationVisible(true)
  }

  // 关闭通知抽屉
  const handleCloseNotification = () => {
    setNotificationVisible(false)
  }

  return (
    <Layout className={`min-h-screen ${theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-gray-50'}`}>
      {/* 左侧边栏 */}
      <AdminSidebar
        collapsed={collapsed}
        currentPath={location.pathname}
        onMenuClick={handleMenuClick}
      />

      {/* 主体区域 */}
      <Layout
        className={theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-gray-50'}
        style={{
          marginLeft: collapsed ? 80 : config.sidebarWidth,
          transition: 'margin-left 0.2s',
        }}
      >
        {/* 顶部导航 */}
        <AdminHeader
          collapsed={collapsed}
          onToggleCollapsed={handleToggleCollapsed}
          onNotificationClick={handleNotificationClick}
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
          {/* 标签页导航 */}
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

      {/* 通知抽屉 */}
      <NotificationDrawer
        visible={notificationVisible}
        onClose={handleCloseNotification}
      />
    </Layout>
  )
}

export default VerticalLayout

