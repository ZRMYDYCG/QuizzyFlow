import { SetMetadata } from '@nestjs/common'

/**
 * 权限装饰器
 * 用于标记路由需要的权限
 * 
 * @example
 * ```typescript
 * @RequirePermissions('user:view', 'user:update')
 * @Get('users/:id')
 * async getUser() { }
 * ```
 */
export const PERMISSIONS_KEY = 'permissions'
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions)

/**
 * 权限逻辑：AND（需要所有权限）或 OR（需要任一权限）
 */
export const PERMISSION_LOGIC_KEY = 'permission_logic'
export type PermissionLogic = 'AND' | 'OR'

export const PermissionLogic = (logic: PermissionLogic) =>
  SetMetadata(PERMISSION_LOGIC_KEY, logic)

/**
 * 组合装饰器：需要任一权限即可
 */
export const RequireAnyPermission = (...permissions: string[]) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    RequirePermissions(...permissions)(target, propertyKey, descriptor)
    PermissionLogic('OR')(target, propertyKey, descriptor)
  }
}

/**
 * 组合装饰器：需要所有权限
 */
export const RequireAllPermissions = (...permissions: string[]) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    RequirePermissions(...permissions)(target, propertyKey, descriptor)
    PermissionLogic('AND')(target, propertyKey, descriptor)
  }
}
