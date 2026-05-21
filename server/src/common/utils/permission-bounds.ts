export const SYSTEM_ROLE_USER = 'user'
export const SYSTEM_ROLE_SUPER_ADMIN = 'super_admin'

/** 管理后台员工（含自定义角色，不含 super_admin / user） */
export function isStaffRole(role: string | undefined): boolean {
  if (!role) return false
  return role !== SYSTEM_ROLE_USER && role !== SYSTEM_ROLE_SUPER_ADMIN
}

import { normalizeStaffRolePermissions } from '../constants/admin-assignable'

/**
 * 解析角色权限上限（员工角色会剔除不可分配的普通用户侧权限，保证与分配弹窗数量一致）
 */
export function resolveRolePermissionCeiling(
  roleName: string | undefined,
  permissions: string[],
): string[] {
  const codes = permissions.filter((p) => typeof p === 'string' && p.includes(':'))
  if (isStaffRole(roleName)) {
    return normalizeStaffRolePermissions(codes)
  }
  return codes
}

/**
 * 用户级权限必须在所属角色权限范围内（角色为上限）
 */
export function clampToRolePermissions(
  permissions: string[],
  rolePermissions: string[],
): string[] {
  if (!rolePermissions.length) {
    return []
  }
  const ceiling = new Set(rolePermissions)
  return permissions.filter((p) => ceiling.has(p))
}

/** 仅保留形如 module:action 的权限码（排除树节点模块 key） */
export function filterPermissionCodes(keys: string[]): string[] {
  return keys.filter((k) => k.includes(':'))
}
