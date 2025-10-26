/**
 * 角色常量定义
 */

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const

export type UserRole = typeof ROLES[keyof typeof ROLES]

export const ROLE_NAMES: Record<UserRole, string> = {
  [ROLES.USER]: '普通用户',
  [ROLES.ADMIN]: '管理员',
  [ROLES.SUPER_ADMIN]: '超级管理员',
}

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [ROLES.USER]: '系统普通用户，只能管理自己的内容',
  [ROLES.ADMIN]: '系统管理员，可以管理用户和内容',
  [ROLES.SUPER_ADMIN]: '系统超级管理员，拥有所有权限',
}

export const ROLE_COLORS: Record<UserRole, string> = {
  [ROLES.USER]: 'default',
  [ROLES.ADMIN]: 'blue',
  [ROLES.SUPER_ADMIN]: 'red',
}

