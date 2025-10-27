/**
 * AdminLayout 相关类型定义
 */

export interface AdminLayoutProps {
}

export interface AdminSidebarProps {
  collapsed: boolean
  currentPath: string
  onMenuClick: (key: string) => void
}

export interface AdminHeaderProps {
  collapsed: boolean
  onToggleCollapsed: () => void
  onNotificationClick: () => void
  notificationCount?: number
}

export interface UserDropdownProps {
  username: string
  nickname?: string
  avatar?: string
  onNavigate: (path: string) => void
  onLogout: () => void
}

export interface NotificationDrawerProps {
  visible: boolean
  onClose: () => void
}

