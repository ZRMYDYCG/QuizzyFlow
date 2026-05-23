import { useSelector } from 'react-redux'
import type { stateType } from '@/store'
import type { Permission } from '@/constants/permissions'
import { ROLES } from '@/constants/roles'
import { resolveAccessibleRoutes } from '@/constants/access-registry'
import {
  canAccessAdminPanel,
  clampToRolePermissions,
  isStaffRole,
} from '@/utils/permission-bounds'

/**
 * 权限检查：hasRoute → 页面路由；hasPermission → 操作权限（API/按钮）
 */
export const usePermission = () => {
  const user = useSelector((state: stateType) => state.user)
  const admin = useSelector((state: stateType) => state.admin)

  const isSuperAdmin = user.role === ROLES.SUPER_ADMIN
  const isStaffAdmin = isStaffRole(user.role)
  const effectiveGrantedRoutes =
    admin.grantedRoutes.length > 0
      ? admin.grantedRoutes
      : user.grantedRoutes || []

  const accessibleRoutes = isSuperAdmin
    ? null
    : resolveAccessibleRoutes(effectiveGrantedRoutes)

  const roleCeiling = user.rolePermissions || []
  const rawButtons = isStaffAdmin
    ? [...new Set([...admin.grantedButtons, ...admin.customPermissions])]
    : []
  const buttonSet = new Set(
    isSuperAdmin
      ? []
      : clampToRolePermissions(rawButtons, roleCeiling)
  )

  /**
   * 是否可访问管理后台路由
   */
  const hasRoute = (path: string): boolean => {
    if (isSuperAdmin) return true
    if (!isStaffAdmin) return false
    return accessibleRoutes?.has(path) ?? false
  }

  /**
   * 是否拥有按钮级权限（与后端 API 权限码一致）
   */
  const hasPermission = (permission: Permission | Permission[]): boolean => {
    if (isSuperAdmin) return true
    if (!isStaffAdmin) return false

    if (Array.isArray(permission)) {
      return permission.some((p) => buttonSet.has(p))
    }
    return buttonSet.has(permission)
  }

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (isSuperAdmin) return true
    if (!isStaffAdmin) return false
    return permissions.every((p) => buttonSet.has(p))
  }

  const hasRole = (role: string | string[]): boolean => {
    if (Array.isArray(role)) {
      return role.includes(user.role)
    }
    return user.role === role
  }

  const isAdmin = (): boolean =>
    canAccessAdminPanel(user.role, effectiveGrantedRoutes)

  return {
    hasRoute,
    hasPermission,
    hasAllPermissions,
    hasRole,
    isAdmin,
    isSuperAdmin: () => isSuperAdmin,
    grantedRoutes: admin.grantedRoutes,
    grantedButtons: admin.grantedButtons,
  }
}
