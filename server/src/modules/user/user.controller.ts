import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
  Get,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { UserService } from './user.service'
import { UserStatisticsService } from './user-statistics.service'
import { RegisterDto } from './dto/register.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UpdatePreferencesDto } from './dto/update-preferences.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { UserStatisticsDto } from './dto/user-statistics.dto'
import { Public } from '../../common/decorators/public.decorator'

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userStatisticsService: UserStatisticsService,
  ) {}

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
   * 获取用户完整信息
   * GET /api/user/profile
   */
  @ApiOperation({
    summary: '获取用户完整信息',
    description: '获取当前用户的完整信息（包含偏好设置）',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    type: UserResponseDto,
  })
  @ApiBearerAuth()
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req) {
    const userId = req.user.sub
    return await this.userService.getProfile(userId)
  }

  /**
   * 更新个人信息
   * PATCH /api/user/profile
   */
  @ApiOperation({
    summary: '更新个人信息',
    description: '更新当前用户的基本信息（昵称、头像、简介等）',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: UserResponseDto,
  })
  @ApiBearerAuth()
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.sub
    return await this.userService.updateProfile(userId, updateProfileDto)
  }

  /**
   * 更新用户偏好设置
   * PATCH /api/user/preferences
   */
  @ApiOperation({
    summary: '更新用户偏好设置',
    description: '更新用户的偏好设置（主题、语言、编辑器设置等）',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: UserResponseDto,
  })
  @ApiBearerAuth()
  @Patch('preferences')
  @HttpCode(HttpStatus.OK)
  async updatePreferences(
    @Request() req,
    @Body() updatePreferencesDto: UpdatePreferencesDto,
  ) {
    const userId = req.user.sub
    return await this.userService.updatePreferences(userId, updatePreferencesDto)
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

  /**
   * 获取用户统计数据
   * GET /api/user/statistics
   */
  @ApiOperation({
    summary: '获取用户统计数据',
    description: '获取用户的问卷统计、创建趋势、组件使用情况等',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    type: UserStatisticsDto,
  })
  @ApiBearerAuth()
  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  async getStatistics(@Request() req) {
    const username = req.user.username
    return await this.userStatisticsService.getUserStatistics(username)
  }
}
