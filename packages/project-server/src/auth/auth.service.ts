import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findOne(username, password)

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    const { password: p, ...userInfo } = user.toObject()

    return {
      token: this.jwtService.sign(userInfo),
      user: userInfo,
    }
  }
}
