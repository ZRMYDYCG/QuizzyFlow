export const SYSTEM_ROLE_USER = 'user'
export const SYSTEM_ROLE_SUPER_ADMIN = 'super_admin'

/** 管理后台员工（含自定义角色） */
export function isStaffRole(role: string | undefined): boolean {
  if (!role) return false
  return role !== SYSTEM_ROLE_USER && role !== SYSTEM_ROLE_SUPER_ADMIN
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
