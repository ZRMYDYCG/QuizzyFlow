import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  FileTextOutlined,
  SettingOutlined,
  ProfileOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  FormOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

/**
 * 侧边栏菜单配置
 */
export const sideMenuItems: MenuProps['items'] = [
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
    key: '/admin/templates',
    icon: <AppstoreOutlined />,
    label: '模板管理',
    children: [
      {
        key: '/admin/templates/list',
        label: '模板列表',
      },
      {
        key: '/admin/templates/review',
        label: '审核中心',
      },
      {
        key: '/admin/templates/categories',
        label: '分类管理',
      },
      {
        key: '/admin/templates/statistics',
        label: '统计数据',
      },
    ],
  },
  {
    key: '/admin/answers',
    icon: <FormOutlined />,
    label: '答卷管理',
    children: [
      {
        key: '/admin/answers/list',
        label: '答卷列表',
      },
      {
        key: '/admin/answers/statistics',
        label: '统计分析',
      },
    ],
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

/**
 * 水平菜单配置（用于水平布局）
 */
export const horizontalMenuItems: MenuProps['items'] = [
  {
    key: '/admin/dashboard',
    label: '数据大盘',
  },
  {
    key: '/admin/users',
    label: '用户管理',
  },
  {
    key: '/admin/roles',
    label: '角色管理',
  },
  {
    key: '/admin/permissions',
    label: '权限管理',
  },
  {
    key: '/admin/questions',
    label: '问卷管理',
  },
  {
    key: '/admin/templates',
    label: '模板管理',
    children: [
      {
        key: '/admin/templates/list',
        label: '模板列表',
      },
      {
        key: '/admin/templates/review',
        label: '审核中心',
      },
      {
        key: '/admin/templates/categories',
        label: '分类管理',
      },
      {
        key: '/admin/templates/statistics',
        label: '统计数据',
      },
    ],
  },
  {
    key: '/admin/answers',
    label: '答卷管理',
    children: [
      {
        key: '/admin/answers/list',
        label: '答卷列表',
      },
      {
        key: '/admin/answers/statistics',
        label: '统计分析',
      },
    ],
  },
  {
    key: '/admin/logs',
    label: '操作日志',
  },
  {
    key: '/admin/settings',
    label: '系统设置',
  },
]

/**
 * 用户下拉菜单配置
 * @param onNavigate - 导航回调
 * @param onLogout - 退出登录回调
 */
export const getUserMenuItems = (
  onNavigate: (path: string) => void,
  onLogout: () => void
): MenuProps['items'] => [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: '个人中心',
    onClick: () => onNavigate('/profile'),
  },
  {
    key: 'manage',
    icon: <FileTextOutlined />,
    label: '我的问卷',
    onClick: () => onNavigate('/manage/list'),
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
    onClick: onLogout,
  },
]

