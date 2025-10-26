import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import {
  PERMISSIONS_KEY,
  PERMISSION_LOGIC_KEY,
  PermissionLogic,
} from '../decorators/permissions.decorator'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { RbacService } from '../../modules/rbac/rbac.service'

/**
 * 权限守卫
 * 检查用户是否拥有所需的权限
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查是否为公开路由
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    // 获取所需权限
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    )

    // 如果没有设置权限要求，则允许通过
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true
    }

    // 获取权限逻辑（AND 或 OR）
    const logic = this.reflector.getAllAndOverride<PermissionLogic>(
      PERMISSION_LOGIC_KEY,
      [context.getHandler(), context.getClass()],
    ) || 'AND'

    // 获取用户信息
    const { user } = context.switchToHttp().getRequest()

    if (!user) {
      throw new ForbiddenException('用户未认证')
    }

    // 获取用户的所有权限
    const userPermissions = await this.rbacService.getUserPermissions(
      user.sub || user._id,
    )

    // super_admin 拥有所有权限
    if (user.role === 'super_admin') {
      return true
    }

    // 检查权限
    let hasPermission = false

    if (logic === 'AND') {
      // 需要拥有所有权限
      hasPermission = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      )
    } else {
      // 需要拥有任一权限
      hasPermission = requiredPermissions.some((permission) =>
        userPermissions.includes(permission),
      )
    }

    if (!hasPermission) {
      const logicText = logic === 'AND' ? '所有' : '任一'
      throw new ForbiddenException(
        `需要以下${logicText}权限: ${requiredPermissions.join(', ')}`,
      )
    }

    return true
  }
}

