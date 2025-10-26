import { useSelector } from 'react-redux'
import type { stateType } from '@/store'
import type { Permission } from '@/constants/permissions'
import { ROLES } from '@/constants/roles'

/**
 * 权限检查 Hook
 */
export const usePermission = () => {
  const user = useSelector((state: stateType) => state.user)
  const admin = useSelector((state: stateType) => state.admin)

  /**
   * 检查是否拥有指定权限
   */
  const hasPermission = (permission: Permission | Permission[]): boolean => {
    // 超级管理员拥有所有权限
    if (user.role === ROLES.SUPER_ADMIN) {
      return true
    }

    const permissions = admin.permissions
    const customPermissions = admin.customPermissions

    const allPermissions = [...permissions, ...customPermissions]

    if (Array.isArray(permission)) {
      // 检查是否拥有任一权限
      return permission.some((p) => allPermissions.includes(p))
    } else {
      // 检查是否拥有指定权限
      return allPermissions.includes(permission)
    }
  }

  /**
   * 检查是否拥有所有指定权限
   */
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (user.role === ROLES.SUPER_ADMIN) {
      return true
    }

    const userPermissions = [...admin.permissions, ...admin.customPermissions]
    return permissions.every((p) => userPermissions.includes(p))
  }

  /**
   * 检查是否拥有指定角色
   */
  const hasRole = (role: string | string[]): boolean => {
    if (Array.isArray(role)) {
      return role.includes(user.role)
    } else {
      return user.role === role
    }
  }

  /**
   * 是否为管理员（admin 或 super_admin）
   */
  const isAdmin = (): boolean => {
    return user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN
  }

  /**
   * 是否为超级管理员
   */
  const isSuperAdmin = (): boolean => {
    return user.role === ROLES.SUPER_ADMIN
  }

  return {
    hasPermission,
    hasAllPermissions,
    hasRole,
    isAdmin,
    isSuperAdmin,
  }
}

