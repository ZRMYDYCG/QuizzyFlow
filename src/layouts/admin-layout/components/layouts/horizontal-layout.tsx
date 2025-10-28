import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import { Bell, RotateCw } from 'lucide-react'
import UserDropdown from '../user-dropdown'
import ThemeToggle from '@/components/ThemeToggle'
import NotificationDrawer from '../notification-drawer'
import TabNav from '../tab-nav'
import PageTransition from '../page-transition'
import { useTabNav } from '../../hooks/useTabNav'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { useLogout } from '@/hooks/useLogout'
import { horizontalMenuItems } from '../../config'

const { Header, Content } = Layout

/**
 * 水平布局 - 顶部菜单 + 下方内容区
 * 
 * 布局结构：
 * ┌──────────────────────────────┐
 * │      Header + Menu           │
 * ├──────────────────────────────┤
 * │                              │
 * │         Content              │
 * │                              │
 * └──────────────────────────────┘
 */
const HorizontalLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, primaryColor } = useTheme()
  const { config } = useLayoutConfig()
  const { username, nickname, avatar } = useGetUserInfo()
  const { logout } = useLogout()
  const [notificationVisible, setNotificationVisible] = useState(false)
  const [isReloading, setIsReloading] = useState(false)

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
        {/* Logo + 水平菜单 */}
        <div className="flex items-center gap-6 flex-1">
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

          {/* 水平菜单 */}
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            onClick={handleMenuClick}
            items={horizontalMenuItems}
            className={`
              flex-1 border-none
              ${theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-white'}
            `}
            style={{ lineHeight: '62px' }}
          />
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-3">
          {/* 重载按钮 */}
          {config.showReloadButton && (
            <button
              onClick={handleReload}
              disabled={isReloading}
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center transition-all
                ${theme === 'dark' ? 'bg-[#2a2a2f] hover:bg-[#35353a] text-slate-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}
                ${isReloading ? 'cursor-not-allowed opacity-50' : 'hover:text-white'}
              `}
              title="重载页面"
            >
              <RotateCw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} strokeWidth={2} />
            </button>
          )}

          {/* 通知按钮 */}
          <button
            onClick={() => setNotificationVisible(true)}
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center hover:text-white transition-colors
              ${theme === 'dark' ? 'bg-[#2a2a2f] hover:bg-[#35353a] text-slate-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}
            `}
            title="通知"
          >
            <Bell className="w-4 h-4" strokeWidth={2} />
          </button>

          {/* 主题切换 */}
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

      {/* 内容区域 */}
      <Content
        className="mx-6 my-6"
        style={{
          marginTop: 80,
          minHeight: 'calc(100vh - 96px)',
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

      {/* 通知抽屉 */}
      <NotificationDrawer
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />
    </Layout>
  )
}

export default HorizontalLayout

