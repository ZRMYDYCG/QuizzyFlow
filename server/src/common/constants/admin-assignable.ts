import {
  PERMISSIONS,
  PERMISSION_DESCRIPTIONS,
  PERMISSIONS_BY_MODULE,
  PermissionModule,
} from './permissions'

/** 管理后台员工不可被分配的「普通用户侧」权限 */
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

/** 管理后台角色权限：仅保留可分配给员工的权限码（与分配弹窗同一目录） */
export function normalizeStaffRolePermissions(permissions: string[]): string[] {
  return permissions
    .filter((code) => typeof code === 'string' && code.includes(':'))
    .filter((code) => ADMIN_ASSIGNABLE_SET.has(code))
}

const MODULE_LABELS: Record<PermissionModule, string> = {
  [PermissionModule.USER]: '用户管理',
  [PermissionModule.QUESTION]: '问卷管理',
  [PermissionModule.TEMPLATE]: '模板管理',
  [PermissionModule.ANSWER]: '答卷管理',
  [PermissionModule.STATISTICS]: '统计分析',
  [PermissionModule.ADMIN]: '管理员',
  [PermissionModule.ROLE]: '角色管理',
  [PermissionModule.PERMISSION]: '权限管理',
  [PermissionModule.SYSTEM]: '系统管理',
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

export function getAdminPermissionCatalog(): AdminPermissionGroup[] {
  const assignable = new Set(ADMIN_ASSIGNABLE_PERMISSION_CODES)

  return (Object.entries(PERMISSIONS_BY_MODULE) as [PermissionModule, string[]][])
    .map(([module, codes]) => ({
      module,
      moduleName: MODULE_LABELS[module] || module,
      items: codes
        .filter((code) => assignable.has(code))
        .map((code) => ({
          code,
          name: PERMISSION_DESCRIPTIONS[code]?.name || code,
          description: PERMISSION_DESCRIPTIONS[code]?.description || '',
        })),
    }))
    .filter((group) => group.items.length > 0)
}
