import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from '@/modules/user/dto/login.dto'
import { UserResponseDto } from '@/modules/user/dto/user-response.dto'
import { Public } from '@/common/decorators/public.decorator'

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * 用户登录
   * POST /api/auth/login
   */
  @ApiOperation({ summary: '用户登录', description: '通过邮箱和密码登录系统' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '登录成功，返回访问令牌',
    schema: {
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '用户名或密码错误',
  })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.signIn(loginDto)
  }

  /**
   * 获取当前用户信息
   * GET /api/auth/profile
   */
  @ApiOperation({ summary: '获取当前用户信息', description: '获取已登录用户的个人信息' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权，请先登录',
  })
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.sub
    return await this.authService.getProfile(userId)
  }
}
