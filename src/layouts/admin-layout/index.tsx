import React, { useState, Suspense, lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { Spin, ConfigProvider, FloatButton } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { useLoadUserData } from '@/hooks/useLoadUserData'
import { ROLES } from '@/constants/roles'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import { editorDarkTheme, editorLightTheme } from '@/config/theme.config'
import LayoutSettings from './components/layout-settings'
import ProgressBar from './components/progress-bar'

// 懒加载布局组件以优化首屏加载
const VerticalLayout = lazy(() => import('./layouts/VerticalLayout'))
const HorizontalLayout = lazy(() => import('./layouts/HorizontalLayout'))
const MixedLayout = lazy(() => import('./layouts/MixedLayout'))
const ColumnsLayout = lazy(() => import('./layouts/ColumnsLayout'))

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

  // 根据主题选择 Ant Design 配置
  const currentTheme = theme === 'dark' ? editorDarkTheme : editorLightTheme

  // 未登录，重定向到登录页
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // 等待用户数据加载
  if (waitingUserData) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-gray-50'}`}>
        <Spin size="large" tip="加载用户数据..." />
      </div>
    )
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
    <ConfigProvider theme={currentTheme}>
      {/* 顶部进度条 */}
      <ProgressBar />
      
      {/* 渲染选中的布局 */}
      {renderLayout()}

      {/* 布局设置抽屉 */}
      <LayoutSettings
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />

      {/* 布局设置浮动按钮 */}
      <FloatButton
        icon={<SettingOutlined />}
        type="primary"
        onClick={() => setSettingsVisible(true)}
        tooltip="布局设置"
        style={{ right: 24, bottom: 24 }}
      />
    </ConfigProvider>
  )
}

export default AdminLayout

