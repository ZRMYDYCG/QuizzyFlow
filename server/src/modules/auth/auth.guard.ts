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

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      // 💡 See this condition
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException('未登录')
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JwtConstants.secret,
      })

      request['user'] = payload // 将用户信息存入request对象中
    } catch {
      throw new UnauthorizedException('Token 无效或已过期')
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
