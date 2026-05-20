import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtConstants } from './auth.constants'
import { Request } from 'express'
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator'
import { Reflector } from '@nestjs/core'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (isPublic) {
      // 公开路由：有 token 时仍解析用户，供「未发布但作者可访问」等权限判断
      if (token) {
        await this.attachUserFromToken(request, token, false)
      }
      return true
    }

    if (!token) {
      throw new UnauthorizedException('未登录')
    }
    await this.attachUserFromToken(request, token, true)
    return true
  }

  private async attachUserFromToken(
    request: Request,
    token: string,
    required: boolean,
  ): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JwtConstants.secret,
      })

      const userId = payload.sub as string
      const user = await this.userService.assertUserCanAccess(userId)
      request['user'] = this.userService.toRequestUser(user)
    } catch (error) {
      if (!required) {
        return
      }
      if (error instanceof UnauthorizedException) {
        throw error
      }
      throw new UnauthorizedException('Token 无效或已过期')
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
