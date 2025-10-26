import { SetMetadata } from '@nestjs/common'

/**
 * 角色装饰器
 * 用于标记路由需要的角色
 * 
 * @example
 * ```typescript
 * @Roles('admin', 'super_admin')
 * @Get('users')
 * async getUsers() { }
 * ```
 */
export const ROLES_KEY = 'roles'
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)

