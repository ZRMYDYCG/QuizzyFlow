import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import { Bell, RotateCw } from 'lucide-react'
import UserDropdown from '../components/user-dropdown'
import ThemeToggle from '@/components/ThemeToggle'
import NotificationDrawer from '../components/notification-drawer'
import TabNav from '../components/tab-nav'
import PageTransition from '../components/page-transition'
import { useTabNav } from '../hooks/useTabNav'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { useLogout } from '@/hooks/useLogout'
import { horizontalMenuItems, sideMenuItems } from '../config'

const { Header, Sider, Content } = Layout

/**
 * 混合布局 - 顶部一级菜单 + 左侧二级菜单
 * 
 * 布局结构：
 * ┌──────────────────────────────┐
 * │      Header + Top Menu       │
 * ├─────────┬────────────────────┤
 * │         │                    │
 * │ Submenu │     Content        │
 * │         │                    │
 * └─────────┴────────────────────┘
 */
const MixedLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, primaryColor } = useTheme()
  const { config } = useLayoutConfig()
  const { username, nickname, avatar } = useGetUserInfo()
  const { logout } = useLogout()
  const [notificationVisible, setNotificationVisible] = useState(false)
  const [isReloading, setIsReloading] = useState(false)
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

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const handleReload = () => {
    setIsReloading(true)
    window.location.reload()
  }

  return (
    <Layout className={`min-h-screen ${theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-gray-50'}`}>
      {/* 顶部导航栏 */}
      <Header
        className={`
          ${theme === 'dark' ? 'bg-[#1a1a1f] border-white/5' : 'bg-white border-gray-200'} 
          shadow-sm px-6 flex items-center justify-between fixed z-10 border-b w-full
        `}
        style={{ height: 64 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: primaryColor }}
          >
            Q
          </div>
          <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            QuizzyFlow
          </span>
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-3">
          {config.showReloadButton && (
            <button
              onClick={handleReload}
              disabled={isReloading}
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center transition-all
                ${theme === 'dark' ? 'bg-[#2a2a2f] hover:bg-[#35353a] text-slate-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}
                ${isReloading ? 'cursor-not-allowed opacity-50' : 'hover:text-white'}
              `}
            >
              <RotateCw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} strokeWidth={2} />
            </button>
          )}

          <button
            onClick={() => setNotificationVisible(true)}
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center hover:text-white transition-colors
              ${theme === 'dark' ? 'bg-[#2a2a2f] hover:bg-[#35353a] text-slate-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}
            `}
          >
            <Bell className="w-4 h-4" strokeWidth={2} />
          </button>

          <ThemeToggle />

          <UserDropdown
            username={username}
            nickname={nickname}
            avatar={avatar}
            onNavigate={handleNavigate}
            onLogout={logout}
          />
        </div>
      </Header>

      <Layout style={{ marginTop: 64 }}>
        {/* 左侧菜单 */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={200}
          className={theme === 'dark' ? 'bg-[#1e1e23]' : 'bg-white'}
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 0,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={handleMenuClick}
            items={sideMenuItems}
            className={theme === 'dark' ? 'bg-[#1e1e23]' : 'bg-white'}
          />
        </Sider>

        {/* 主内容区 */}
        <Layout
          className={theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-gray-50'}
          style={{
            marginLeft: collapsed ? 80 : 200,
            transition: 'margin-left 0.2s',
          }}
        >
          <Content
            className="mx-6 my-6"
            style={{
              minHeight: 'calc(100vh - 96px)',
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
      </Layout>

      <NotificationDrawer
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />
    </Layout>
  )
}

export default MixedLayout

