import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Layout, Spin } from 'antd'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { useLoadUserData } from '@/hooks/useLoadUserData'
import { ROLES } from '@/constants/roles'
import AdminSidebar from './components/admin-sidebar'
import AdminHeader from './components/admin-header'
import NotificationDrawer from './components/notification-drawer'

const { Content } = Layout

/**
 * 管理后台布局
 */
const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { token, role } = useGetUserInfo()
  const { waitingUserData } = useLoadUserData()
  const [collapsed, setCollapsed] = useState(false)
  const [notificationVisible, setNotificationVisible] = useState(false)

  // 权限检查
  const isAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN

  // 未登录，重定向到登录页
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // 等待用户数据加载
  if (waitingUserData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="加载用户数据..." />
      </div>
    )
  }

  // 不是管理员，重定向到 403 页面
  if (!isAdmin) {
    return <Navigate to="/403" replace />
  }

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
    <Layout className="min-h-screen">
      {/* 侧边栏 */}
      <AdminSidebar
        collapsed={collapsed}
        currentPath={location.pathname}
        onMenuClick={handleMenuClick}
      />

      {/* 主体区域 */}
      <Layout
        style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.2s' }}
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
          <div className="bg-white rounded-lg shadow-sm p-6 min-h-full">
            <Outlet />
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

export default AdminLayout

