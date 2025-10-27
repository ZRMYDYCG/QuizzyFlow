import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { LoginDto } from '../user/dto/login.dto'
import { UserResponseDto } from '../user/dto/user-response.dto'

/**
 * JWT 载荷接口
 */
interface JwtPayload {
  sub: string // 用户ID
  username: string
  nickname: string
  role?: string // 用户角色
  customPermissions?: string[] // 自定义权限
}

/**
 * 登录响应接口
 */
export interface LoginResponse {
  token: string
  user: UserResponseDto
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 用户登录
   */
  async signIn(loginDto: LoginDto): Promise<LoginResponse> {
    const { username, password } = loginDto

    // 验证用户凭证
    const user = await this.userService.validateUser(username, password)

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误')
    }

    // 生成 JWT token，包含 role 和权限信息
    const payload: JwtPayload = {
      sub: user._id.toString(),
      username: user.username,
      nickname: user.nickname,
      role: user.role || 'user',
      customPermissions: user.customPermissions || [],
    }

    const token = await this.jwtService.signAsync(payload)

    // 返回不包含密码的用户信息
    const userResponse = new UserResponseDto(user.toObject())

    return {
      token,
      user: userResponse,
    }
  }

  /**
   * 验证 token 并获取用户信息
   */
  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token)
      return payload
    } catch (error) {
      throw new UnauthorizedException('无效的token')
    }
  }

  /**
   * 获取当前用户信息
   */
  async getProfile(userId: string): Promise<UserResponseDto> {
    return await this.userService.findById(userId)
  }
}
