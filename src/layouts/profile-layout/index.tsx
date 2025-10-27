import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Typography, Drawer } from 'antd'
import {
  UserOutlined,
  SafetyOutlined,
  BarChartOutlined,
  SettingOutlined,
  LeftOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { useSelector } from 'react-redux'
import type { stateType } from '@/store'
import { clsx } from 'clsx'
import { useLoadUserData } from '@/hooks/useLoadUserData'
import Logo from '@/components/Logo'
import { useTheme } from '@/contexts/ThemeContext'

const { Sider, Content } = Layout
const { Title, Text } = Typography

const ProfileLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector((state: stateType) => state.user)
  const { theme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // 加载用户数据（刷新时重新获取）
  useLoadUserData()

  // 菜单项配置
  const menuItems = [
    {
      key: '/profile/overview',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: '/profile/info',
      icon: <UserOutlined />,
      label: '基本信息',
    },
    {
      key: '/profile/security',
      icon: <SafetyOutlined />,
      label: '账户安全',
    },
    {
      key: '/profile/statistics',
      icon: <BarChartOutlined />,
      label: '数据统计',
    },
    {
      key: '/profile/settings',
      icon: <SettingOutlined />,
      label: '偏好设置',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
    setMobileMenuOpen(false)  // 移动端点击后关闭菜单
  }

  const handleBackToManage = () => {
    navigate('/manage/list')
    setMobileMenuOpen(false)
  }

  // 侧边栏内容（桌面端和移动端共用）
  const sidebarContent = (
    <>
      {/* Logo */}
      {!collapsed && (
        <div className="px-6 pt-2 pb-6 border-b border-gray-200 dark:border-gray-700">
          <Logo size="small" showText={true} />
        </div>
      )}

      {/* 用户信息头部 */}
      <div className={clsx(
        'p-6 border-b border-gray-200 dark:border-gray-700',
        collapsed && 'p-4'
      )}>
        <div className="flex flex-col items-center">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt="avatar" 
              className={clsx(
                'mb-3 rounded-full object-cover shadow-md',
                collapsed ? 'w-10 h-10' : 'w-16 h-16'
              )}
            />
          ) : (
            <Avatar
              size={collapsed ? 40 : 64}
              icon={<UserOutlined />}
              className="mb-3 bg-blue-500"
            >
              {(user.nickname || user.username || 'U').charAt(0).toUpperCase()}
            </Avatar>
          )}
          {!collapsed && (
            <>
              <Title level={5} className="!mb-1 text-center">
                {user.nickname || user.username}
              </Title>
              <Text type="secondary" className="text-xs">
                {user.username}
              </Text>
            </>
          )}
        </div>
      </div>

      {/* 返回管理按钮 */}
      <div className="p-4">
        <button
          onClick={handleBackToManage}
          className={clsx(
            'w-full flex items-center justify-center gap-2',
            'px-4 py-2.5 rounded-lg',
            'text-sm font-medium',
            theme === 'dark' 
              ? 'text-slate-300 bg-slate-800 hover:bg-slate-700' 
              : 'text-gray-700 bg-gray-100 hover:bg-gray-200',
            'transition-all shadow-sm hover:shadow'
          )}
        >
          <LeftOutlined className="text-xs" />
          {!collapsed && '返回管理'}
        </button>
      </div>

      {/* 导航菜单 */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        className="border-0 bg-transparent"
      />
    </>
  )

  return (
    <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 移动端顶部导航栏 */}
      <div className={clsx(
        'md:hidden',
        'fixed top-0 left-0 right-0 z-50',
        'h-14 bg-white dark:bg-gray-800',
        'border-b border-gray-200 dark:border-gray-700',
        'flex items-center justify-between px-4'
      )}>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-gray-700 dark:text-gray-300"
        >
          <MenuOutlined className="text-xl" />
        </button>
        <Title level={5} className="!mb-0">
          个人中心
        </Title>
        <div className="w-10" />  {/* 占位，保持居中 */}
      </div>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title={null}
        placement="left"
        width={280}
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className="md:hidden"
        styles={{ body: { padding: 0 } }}
      >
        <div className="bg-white dark:bg-gray-800 h-full">
          {sidebarContent}
        </div>
      </Drawer>

      {/* 桌面端侧边栏 */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className={clsx(
          'hidden md:block',  // 移动端隐藏
          'bg-white dark:bg-gray-800',
          'border-r border-gray-200 dark:border-gray-700',
          '!fixed left-0 top-0 bottom-0 z-50',
          'overflow-auto'
        )}
        width={240}
        theme="light"
      >
        {sidebarContent}
      </Sider>

      {/* 主内容区 */}
      <Layout
        className={clsx(
          'transition-all duration-200',
          // 桌面端根据侧边栏状态调整边距
          'md:ml-20 md:mr-0',
          !collapsed && 'md:ml-60',
          // 移动端顶部留出导航栏空间
          'pt-14 md:pt-0'
        )}
      >
        <Content className="p-3 md:p-6">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default ProfileLayout

