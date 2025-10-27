import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AdminService } from './admin.service'
import { QueryUsersDto } from './dto/query-users.dto'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'
import { BanUserDto } from './dto/ban-user.dto'
import { CreateAdminUserDto } from './dto/create-admin-user.dto'
import { RolesGuard } from '../../common/guards/roles.guard'
import { PermissionsGuard } from '../../common/guards/permissions.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { RequirePermissions } from '../../common/decorators/permissions.decorator'
import { LogOperation } from '../../common/decorators/log-operation.decorator'
import { PERMISSIONS } from '../../common/constants/permissions'

/**
 * 管理员控制器
 * 提供用户管理、系统统计等管理功能
 */
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * 获取系统统计数据
   */
  @Get('statistics')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.STATISTICS_VIEW_ALL)
  async getStatistics() {
    return await this.adminService.getSystemStatistics()
  }

  /**
   * 获取用户活跃度
   */
  @Get('statistics/user-activity')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.STATISTICS_VIEW_ALL)
  async getUserActivity(@Query('days') days?: string) {
    return await this.adminService.getUserActivity(
      days ? Number(days) : 30,
    )
  }

  /**
   * 获取用户列表
   */
  @Get('users')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.USER_VIEW_ALL)
  async getUsers(@Query() queryDto: QueryUsersDto) {
    return await this.adminService.getUsers(queryDto)
  }

  /**
   * 获取用户详情
   */
  @Get('users/:id')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.USER_VIEW_ALL)
  async getUserDetail(@Param('id') id: string): Promise<any> {
    return await this.adminService.getUserDetail(id)
  }

  /**
   * 创建管理员用户
   */
  @Post('users')
  @Roles('super_admin')
  @RequirePermissions(PERMISSIONS.USER_CREATE)
  @LogOperation({
    module: 'user',
    action: 'create',
    resource: 'user',
    description: '创建用户',
  })
  async createUser(@Body() createDto: CreateAdminUserDto, @Request() req) {
    return await this.adminService.createAdminUser(
      createDto,
      req.user.username,
    )
  }

  /**
   * 更新用户角色
   */
  @Patch('users/:id/role')
  @Roles('super_admin')
  @RequirePermissions(PERMISSIONS.USER_MANAGE_ROLE)
  @LogOperation({
    module: 'user',
    action: 'update_role',
    resource: 'user',
    description: '更新用户角色',
  })
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserRoleDto,
    @Request() req,
  ) {
    return await this.adminService.updateUserRole(
      id,
      updateDto,
      req.user.username,
    )
  }

  /**
   * 封禁/解封用户
   */
  @Patch('users/:id/ban')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.USER_BAN)
  @LogOperation({
    module: 'user',
    action: 'ban',
    resource: 'user',
    description: '封禁/解封用户',
  })
  async banUser(
    @Param('id') id: string,
    @Body() banDto: BanUserDto,
    @Request() req,
  ) {
    return await this.adminService.banUser(id, banDto, req.user.username)
  }

  /**
   * 重置用户密码
   */
  @Patch('users/:id/reset-password')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.USER_RESET_PASSWORD)
  @LogOperation({
    module: 'user',
    action: 'reset_password',
    resource: 'user',
    description: '重置用户密码',
  })
  async resetPassword(
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
  ) {
    return await this.adminService.resetUserPassword(id, newPassword)
  }

  /**
   * 删除用户
   */
  @Delete('users/:id')
  @Roles('super_admin')
  @RequirePermissions(PERMISSIONS.USER_DELETE)
  @LogOperation({
    module: 'user',
    action: 'delete',
    resource: 'user',
    description: '删除用户',
  })
  async deleteUser(@Param('id') id: string) {
    return await this.adminService.deleteUser(id)
  }

  /**
   * 获取所有问卷列表（管理员）
   */
  @Get('questions')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.QUESTION_VIEW_ALL)
  async getQuestions(@Query() query: any) {
    return await this.adminService.getQuestions(query)
  }

  /**
   * 获取问卷统计数据
   */
  @Get('questions/statistics')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.STATISTICS_VIEW_ALL)
  async getQuestionStatistics() {
    return await this.adminService.getQuestionStatistics()
  }

  /**
   * 获取问卷详情（管理员）
   */
  @Get('questions/:id')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.QUESTION_VIEW_ALL)
  async getQuestionDetail(@Param('id') id: string) {
    return await this.adminService.getQuestionDetail(id)
  }

  /**
   * 更新问卷状态（发布/下架）
   */
  @Patch('questions/:id/status')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.QUESTION_MANAGE)
  @LogOperation({
    module: 'question',
    action: 'update',
    resource: 'question',
    description: '更新问卷状态',
  })
  async updateQuestionStatus(
    @Param('id') id: string,
    @Body() updateDto: any,
    @Request() req,
  ) {
    return await this.adminService.updateQuestionStatus(
      id,
      updateDto,
      req.user.username,
    )
  }

  /**
   * 删除问卷（管理员）
   */
  @Delete('questions/:id')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.QUESTION_DELETE)
  @LogOperation({
    module: 'question',
    action: 'delete',
    resource: 'question',
    description: '删除问卷',
  })
  async deleteQuestion(@Param('id') id: string, @Request() req) {
    return await this.adminService.deleteQuestion(id, req.user.username)
  }

  /**
   * 设置问卷为推荐
   */
  @Patch('questions/:id/recommended')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.QUESTION_MANAGE)
  @LogOperation({
    module: 'question',
    action: 'update',
    resource: 'question',
    description: '设置问卷推荐状态',
  })
  async setQuestionRecommended(
    @Param('id') id: string,
    @Body() body: { isRecommended: boolean },
    @Request() req,
  ) {
    return await this.adminService.setQuestionRecommended(
      id,
      body.isRecommended,
      req.user.username,
    )
  }
}

