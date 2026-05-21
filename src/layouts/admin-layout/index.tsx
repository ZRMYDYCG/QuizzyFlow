import React, { useState, Suspense, lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { Spin, FloatButton } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { useLoadUserData } from '@/hooks/useLoadUserData'
import { ROLES } from '@/constants/roles'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import LayoutSettings from './components/layout-settings'
import ProgressBar from './components/progress-bar'

// 懒加载布局组件以优化首屏加载
const VerticalLayout = lazy(() => import('./components/layouts/vertical-layout'))
const HorizontalLayout = lazy(() => import('./components/layouts/horizontal-layout'))
const MixedLayout = lazy(() => import('./components/layouts/mixed-layout'))
const ColumnsLayout = lazy(() => import('./components/layouts/columns-layout'))

/**
 * 管理后台布局
 * 根据配置动态选择布局模式
 */
const AdminLayout: React.FC = () => {
  const { token, role } = useGetUserInfo()
  const { waitingUserData } = useLoadUserData()
  const { theme } = useTheme()
  const { config } = useLayoutConfig()
  const [settingsVisible, setSettingsVisible] = useState(false)

  // 权限检查
  const isAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN

  // 刷新时 Redux token 尚未恢复，须先等待 useLoadUserData，避免误跳登录页
  if (waitingUserData) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-gray-50'}`}>
        <Spin size="large" tip="加载用户数据..." />
      </div>
    )
  }

  // 未登录，重定向到登录页
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // 不是管理员，重定向到 403 页面
  if (!isAdmin) {
    return <Navigate to="/403" replace />
  }

  // 根据配置选择布局组件
  const renderLayout = () => {
    const LayoutComponent = (() => {
      switch (config.layoutMode) {
        case 'horizontal':
          return HorizontalLayout
        case 'mixed':
          return MixedLayout
        case 'columns':
          return ColumnsLayout
        case 'vertical':
        default:
          return VerticalLayout
      }
    })()

    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Spin size="large" tip="加载布局中..." />
          </div>
        }
      >
        <LayoutComponent />
      </Suspense>
    )
  }

  return (
    <>
      <ProgressBar />
      {renderLayout()}
      <LayoutSettings
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
      <FloatButton
        icon={<SettingOutlined />}
        type="primary"
        onClick={() => setSettingsVisible(true)}
        tooltip="布局设置"
        style={{ right: 24, bottom: 24 }}
      />
    </>
  )
}

export default AdminLayout

