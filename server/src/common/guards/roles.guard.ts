import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

/**
 * 角色守卫
 * 检查用户是否拥有所需的角色
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 检查是否为公开路由
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    // 获取所需角色
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    // 如果没有设置角色要求，则允许通过
    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    // 获取用户信息
    const { user } = context.switchToHttp().getRequest()

    if (!user) {
      throw new ForbiddenException('用户未认证')
    }

    // 检查用户角色
    const userRole = user.role || 'user'

    // super_admin 拥有所有权限
    if (userRole === 'super_admin') {
      return true
    }

    // 检查是否拥有所需角色之一
    const hasRole = requiredRoles.includes(userRole)

    if (!hasRole) {
      throw new ForbiddenException(
        `需要以下角色之一: ${requiredRoles.join(', ')}`,
      )
    }

    return true
  }
}

