import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { JwtConstants } from './auth.constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConstants.secret,
    })
  }

  async validate(payload: any) {
    // 这里的 payload 是 JWT token 解码后的内容
    // 返回的对象会被附加到 request.user
    return {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
      customPermissions: payload.customPermissions || [],
    }
  }
}

