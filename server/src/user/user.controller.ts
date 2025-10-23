import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
} from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterDto } from './dto/register.dto'
import { Public } from '../auth/decorators/public.decorator'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 用户注册
   * POST /api/user/register
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return await this.userService.create(registerDto)
  }

  /**
   * 修改密码
   * PATCH /api/user/password
   */
  @Patch('password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    const userId = req.user.sub
    await this.userService.changePassword(
      userId,
      body.oldPassword,
      body.newPassword,
    )
    return { message: '密码修改成功' }
  }
}
