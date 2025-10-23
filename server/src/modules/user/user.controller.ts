import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { UserService } from './user.service'
import { RegisterDto } from './dto/register.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { Public } from '../../common/decorators/public.decorator'

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 用户注册
   * POST /api/user/register
   */
  @ApiOperation({ summary: '用户注册', description: '创建新用户账号' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '注册成功',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '参数验证失败或用户已存在',
  })
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
  @ApiOperation({ summary: '修改密码', description: '修改当前用户的密码' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '密码修改成功',
    schema: {
      properties: {
        message: { type: 'string', example: '密码修改成功' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权或旧密码错误',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '参数验证失败',
  })
  @ApiBearerAuth()
  @Patch('password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.sub
    await this.userService.changePassword(
      userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    )
    return { message: '密码修改成功' }
  }
}
