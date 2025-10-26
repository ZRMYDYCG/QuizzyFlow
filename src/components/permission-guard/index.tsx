import React from 'react'
import { Navigate } from 'react-router-dom'
import { usePermission } from '@/hooks/usePermission'
import type { Permission } from '@/constants/permissions'
import { Empty } from 'antd'

interface PermissionGuardProps {
  permission?: Permission | Permission[]
  role?: string | string[]
  fallback?: React.ReactNode
  redirect?: string
  children: React.ReactNode
}

/**
 * 权限守卫组件
 * 用于控制页面或组件的访问权限
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  role,
  fallback,
  redirect,
  children,
}) => {
  const { hasPermission, hasRole } = usePermission()

  // 检查权限
  if (permission && !hasPermission(permission)) {
    if (redirect) {
      return <Navigate to={redirect} replace />
    }
    if (fallback) {
      return <>{fallback}</>
    }
    return (
      <Empty
        description="您没有权限访问此内容"
        style={{ marginTop: '100px' }}
      />
    )
  }

  // 检查角色
  if (role && !hasRole(role)) {
    if (redirect) {
      return <Navigate to={redirect} replace />
    }
    if (fallback) {
      return <>{fallback}</>
    }
    return (
      <Empty
        description="您的角色无权访问此内容"
        style={{ marginTop: '100px' }}
      />
    )
  }

  return <>{children}</>
}

/**
 * 权限控制组件（不显示fallback，直接隐藏）
 */
interface PermissionControlProps {
  permission?: Permission | Permission[]
  role?: string | string[]
  children: React.ReactNode
}

export const PermissionControl: React.FC<PermissionControlProps> = ({
  permission,
  role,
  children,
}) => {
  const { hasPermission, hasRole } = usePermission()

  // 检查权限
  if (permission && !hasPermission(permission)) {
    return null
  }

  // 检查角色
  if (role && !hasRole(role)) {
    return null
  }

  return <>{children}</>
}

