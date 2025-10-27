import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Layout, Menu, Dropdown, Avatar, Badge, Button, Drawer, Spin } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from '@ant-design/icons'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { useLogout } from '@/hooks/useLogout'
import { useLoadUserData } from '@/hooks/useLoadUserData'
import { ROLES } from '@/constants/roles'
import Logo from '@/components/Logo'
import type { MenuProps } from 'antd'

const { Header, Sider, Content } = Layout

/**
 * 管理后台布局
 */
const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { username, nickname, avatar, token, role } = useGetUserInfo()
  const { logout } = useLogout()
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

  // 侧边栏菜单项
  const menuItems: MenuProps['items'] = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: '数据大盘',
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/admin/roles',
      icon: <TeamOutlined />,
      label: '角色管理',
    },
    {
      key: '/admin/permissions',
      icon: <SafetyOutlined />,
      label: '权限管理',
    },
    {
      key: '/admin/questions',
      icon: <FileTextOutlined />,
      label: '问卷管理',
    },
    {
      key: '/admin/logs',
      icon: <ProfileOutlined />,
      label: '操作日志',
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ]

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'manage',
      icon: <FileTextOutlined />,
      label: '我的问卷',
      onClick: () => navigate('/manage/list'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout,
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <Layout className="min-h-screen">
      {/* 侧边栏 */}
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
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-r-0"
        />
      </Sider>

      {/* 主体区域 */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.2s' }}>
        {/* 顶部导航 */}
        <Header className="bg-white shadow-sm px-6 flex items-center justify-between fixed w-full z-10">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg"
            />
            <div className="ml-4 text-gray-600">
              管理后台
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* 通知 */}
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => setNotificationVisible(true)}
                className="text-lg"
              />
            </Badge>

            {/* 用户菜单 */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded">
                <Avatar
                  src={avatar}
                  icon={<UserOutlined />}
                  size="small"
                />
                <span className="text-sm font-medium">{nickname || username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

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
      <Drawer
        title="通知"
        placement="right"
        onClose={() => setNotificationVisible(false)}
        open={notificationVisible}
        width={400}
      >
        <div className="text-center text-gray-400 py-8">
          暂无新通知
        </div>
      </Drawer>
    </Layout>
  )
}

export default AdminLayout

