export const SYSTEM_ROLE_USER = 'user'
export const SYSTEM_ROLE_SUPER_ADMIN = 'super_admin'

/** 管理后台员工（含自定义角色） */
export function isStaffRole(role: string | undefined): boolean {
  if (!role) return false
  const normalized = role.trim().toLowerCase()
  return (
    normalized !== SYSTEM_ROLE_USER && normalized !== SYSTEM_ROLE_SUPER_ADMIN
  )
}

/**
 * 是否可进入管理后台（入口展示 / 布局守卫）
 * - super_admin：始终允许
 * - user：始终拒绝
 * - 其他员工角色：须至少分配一条管理后台路由
 */
export function canAccessAdminPanel(
  role: string | undefined,
  grantedRoutes: string[] | undefined
): boolean {
  if (!role) return false
  const normalized = role.trim().toLowerCase()
  if (normalized === SYSTEM_ROLE_USER) return false
  if (normalized === SYSTEM_ROLE_SUPER_ADMIN) return true
  if (!isStaffRole(normalized)) return false
  return (grantedRoutes?.length ?? 0) > 0
}

import { normalizeStaffRolePermissions } from '@/constants/admin-assignable'

/** 与分配弹窗一致的角色权限上限 */
export function resolveRolePermissionCeiling(
  roleName: string | undefined,
  permissions: string[]
): string[] {
  const codes = (permissions || []).filter(
    (p) => typeof p === 'string' && p.includes(':')
  )
  if (isStaffRole(roleName)) {
    return normalizeStaffRolePermissions(codes)
  }
  return codes
}

/** 用户级权限不得超出角色权限上限 */
export function clampToRolePermissions(
  permissions: string[],
  rolePermissions: string[]
): string[] {
  if (!rolePermissions.length) return []
  const ceiling = new Set(rolePermissions)
  return permissions.filter((p) => ceiling.has(p))
}
