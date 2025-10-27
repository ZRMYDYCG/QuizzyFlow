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
import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { QueryRoleDto } from './dto/query-role.dto'
import { RolesGuard } from '../../common/guards/roles.guard'
import { PermissionsGuard } from '../../common/guards/permissions.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { RequirePermissions } from '../../common/decorators/permissions.decorator'
import { LogOperation } from '../../common/decorators/log-operation.decorator'
import { PERMISSIONS } from '../../common/constants/permissions'

/**
 * 角色管理控制器
 */
@Controller('admin/roles')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * 创建角色
   */
  @Post()
  @Roles('super_admin')
  @RequirePermissions(PERMISSIONS.ROLE_CREATE)
  @LogOperation({
    module: 'role',
    action: 'create',
    resource: 'role',
    description: '创建角色',
  })
  async create(@Body() createDto: CreateRoleDto, @Request() req) {
    return await this.roleService.create(createDto, req.user.username)
  }

  /**
   * 获取所有角色
   */
  @Get()
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.ROLE_VIEW)
  async findAll(@Query() queryDto: QueryRoleDto) {
    return await this.roleService.findAll(queryDto)
  }

  /**
   * 获取角色统计
   */
  @Get('statistics')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.ROLE_VIEW)
  async getStatistics() {
    return await this.roleService.getStatistics()
  }

  /**
   * 获取单个角色
   */
  @Get(':id')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.ROLE_VIEW)
  async findOne(@Param('id') id: string) {
    return await this.roleService.findOne(id)
  }

  /**
   * 更新角色
   */
  @Patch(':id')
  @Roles('super_admin')
  @RequirePermissions(PERMISSIONS.ROLE_UPDATE)
  @LogOperation({
    module: 'role',
    action: 'update',
    resource: 'role',
    description: '更新角色',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRoleDto,
    @Request() req,
  ) {
    return await this.roleService.update(id, updateDto, req.user.username)
  }

  /**
   * 删除角色
   */
  @Delete(':id')
  @Roles('super_admin')
  @RequirePermissions(PERMISSIONS.ROLE_DELETE)
  @LogOperation({
    module: 'role',
    action: 'delete',
    resource: 'role',
    description: '删除角色',
  })
  async remove(@Param('id') id: string) {
    return await this.roleService.remove(id)
  }

  /**
   * 添加权限到角色
   */
  @Post(':id/permissions')
  @Roles('super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_ASSIGN)
  @LogOperation({
    module: 'role',
    action: 'add_permissions',
    resource: 'role',
    description: '添加角色权限',
  })
  async addPermissions(
    @Param('id') id: string,
    @Body('permissions') permissions: string[],
    @Request() req,
  ) {
    return await this.roleService.addPermissions(
      id,
      permissions,
      req.user.username,
    )
  }

  /**
   * 移除角色的权限
   */
  @Delete(':id/permissions')
  @Roles('super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_ASSIGN)
  @LogOperation({
    module: 'role',
    action: 'remove_permissions',
    resource: 'role',
    description: '移除角色权限',
  })
  async removePermissions(
    @Param('id') id: string,
    @Body('permissions') permissions: string[],
    @Request() req,
  ) {
    return await this.roleService.removePermissions(
      id,
      permissions,
      req.user.username,
    )
  }

  /**
   * 设置角色的所有权限
   */
  @Patch(':id/permissions')
  @Roles('super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_ASSIGN)
  @LogOperation({
    module: 'role',
    action: 'set_permissions',
    resource: 'role',
    description: '设置角色权限',
  })
  async setPermissions(
    @Param('id') id: string,
    @Body('permissions') permissions: string[],
    @Request() req,
  ) {
    return await this.roleService.setPermissions(
      id,
      permissions,
      req.user.username,
    )
  }
}

