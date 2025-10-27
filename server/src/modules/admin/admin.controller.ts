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
    const stats = await this.adminService.getSystemStatistics()
    return { data: stats }
  }

  /**
   * 获取用户活跃度
   */
  @Get('statistics/user-activity')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.STATISTICS_VIEW_ALL)
  async getUserActivity(@Query('days') days?: string) {
    const activity = await this.adminService.getUserActivity(
      days ? Number(days) : 30,
    )
    return { data: activity }
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
    const user = await this.adminService.getUserDetail(id)
    return { data: user }
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
    const user = await this.adminService.createAdminUser(
      createDto,
      req.user.username,
    )
    return {
      message: '用户创建成功',
      data: user,
    }
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
    const user = await this.adminService.updateUserRole(
      id,
      updateDto,
      req.user.username,
    )
    return {
      message: '角色更新成功',
      data: user,
    }
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
    const user = await this.adminService.banUser(id, banDto, req.user.username)
    return {
      message: banDto.isBanned ? '用户已封禁' : '用户已解封',
      data: user,
    }
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
    await this.adminService.resetUserPassword(id, newPassword)
    return { message: '密码重置成功' }
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
    await this.adminService.deleteUser(id)
    return { message: '用户删除成功' }
  }
}

