import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { usePermission } from '@/hooks/usePermission'
import type { Permission } from '@/constants/permissions'
import { Empty } from 'antd'

interface PermissionGuardProps {
  /** 按钮级权限码 */
  permission?: Permission | Permission[]
  /** 管理后台路由路径，如 /admin/users */
  route?: string
  role?: string | string[]
  fallback?: React.ReactNode
  redirect?: string
  children: React.ReactNode
}

/**
 * 页面守卫：仅校验 grantedRoutes（与操作权限无关）
 * 操作权限（grantedButtons）请用 PermissionControl 控制按钮显隐
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  route,
  role,
  fallback,
  redirect,
  children,
}) => {
  const { hasPermission, hasRoute, hasRole } = usePermission()
  const location = useLocation()

  const routePath =
    route ?? (location.pathname.startsWith('/admin') ? location.pathname : undefined)

  if (routePath && !hasRoute(routePath)) {
    if (redirect) return <Navigate to={redirect} replace />
    if (fallback) return <>{fallback}</>
    return (
      <Empty
        description="您没有权限访问此页面"
        style={{ marginTop: '100px' }}
      />
    )
  }

  // 可选：整页级按钮要求（管理后台路由请勿使用，改由 PermissionControl 控制按钮）
  if (permission && !hasPermission(permission)) {
    if (redirect) return <Navigate to={redirect} replace />
    if (fallback) return <>{fallback}</>
    return (
      <Empty
        description="您没有权限访问此内容"
        style={{ marginTop: '100px' }}
      />
    )
  }

  if (role && !hasRole(role)) {
    if (redirect) return <Navigate to={redirect} replace />
    if (fallback) return <>{fallback}</>
    return (
      <Empty
        description="您的角色无权访问此内容"
        style={{ marginTop: '100px' }}
      />
    )
  }

  return <>{children}</>
}

interface PermissionControlProps {
  permission?: Permission | Permission[]
  route?: string
  role?: string | string[]
  children: React.ReactNode
}

/**
 * 按钮级权限控制（无权限时不渲染子节点）
 */
export const PermissionControl: React.FC<PermissionControlProps> = ({
  permission,
  route,
  role,
  children,
}) => {
  const { hasPermission, hasRoute, hasRole } = usePermission()

  if (route && !hasRoute(route)) return null
  if (permission && !hasPermission(permission)) return null
  if (role && !hasRole(role)) return null

  return <>{children}</>
}
