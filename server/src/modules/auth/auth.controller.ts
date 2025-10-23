import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from '../user/dto/login.dto'
import { Public } from '../../common/decorators/public.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   * POST /api/auth/login
   */
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
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.sub
    return await this.authService.getProfile(userId)
  }
}
