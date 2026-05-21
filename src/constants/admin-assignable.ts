import { PERMISSIONS } from './permissions'

/** 与后端 admin-assignable 保持一致：管理后台可分配的操作权限 */
const EXCLUDED_PERMISSIONS = new Set<string>([
  PERMISSIONS.USER_VIEW,
  PERMISSIONS.USER_UPDATE_SELF,
  PERMISSIONS.QUESTION_VIEW,
  PERMISSIONS.QUESTION_CREATE,
  PERMISSIONS.QUESTION_UPDATE,
  PERMISSIONS.QUESTION_DELETE,
  PERMISSIONS.QUESTION_PUBLISH,
  PERMISSIONS.ANSWER_VIEW,
  PERMISSIONS.STATISTICS_VIEW,
])

export const ADMIN_ASSIGNABLE_PERMISSION_CODES: string[] = (
  Object.values(PERMISSIONS) as string[]
).filter((code) => !EXCLUDED_PERMISSIONS.has(code))

const ADMIN_ASSIGNABLE_SET = new Set(ADMIN_ASSIGNABLE_PERMISSION_CODES)

/** 与后端一致：员工角色在库中的 permissions 应对齐可分配目录 */
export function normalizeStaffRolePermissions(permissions: string[]): string[] {
  return (permissions || [])
    .filter((code) => typeof code === 'string' && code.includes(':'))
    .filter((code) => ADMIN_ASSIGNABLE_SET.has(code))
}

export interface AdminPermissionItem {
  code: string
  name: string
  description: string
}

export interface AdminPermissionGroup {
  module: string
  moduleName: string
  items: AdminPermissionItem[]
}

export interface AdminAccessRegistryResponse {
  routes: import('./access-registry').AdminRouteNode[]
  permissions: AdminPermissionGroup[]
}
