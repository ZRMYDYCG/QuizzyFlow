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
import { PermissionService } from './permission.service'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { QueryPermissionDto } from './dto/query-permission.dto'
import { RolesGuard } from '../../common/guards/roles.guard'
import { PermissionsGuard } from '../../common/guards/permissions.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { RequirePermissions } from '../../common/decorators/permissions.decorator'
import { LogOperation } from '../../common/decorators/log-operation.decorator'
import { PERMISSIONS } from '../../common/constants/permissions'

/**
 * 权限管理控制器
 */
@Controller('admin/permissions')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * 初始化系统权限
   */
  @Post('initialize')
  @Roles('super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_CREATE)
  async initialize() {
    await this.permissionService.initializeSystemPermissions()
    return { message: '系统权限初始化成功' }
  }

  /**
   * 创建自定义权限
   */
  @Post()
  @Roles('super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_CREATE)
  @LogOperation({
    module: 'permission',
    action: 'create',
    resource: 'permission',
    description: '创建权限',
  })
  async create(@Body() createDto: CreatePermissionDto, @Request() req) {
    const permission = await this.permissionService.create(
      createDto,
      req.user.username,
    )
    return {
      message: '权限创建成功',
      data: permission,
    }
  }

  /**
   * 获取所有权限
   */
  @Get()
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_VIEW)
  async findAll(@Query() queryDto: QueryPermissionDto) {
    const permissions = await this.permissionService.findAll(queryDto)
    return {
      data: permissions,
      total: permissions.length,
    }
  }

  /**
   * 按模块分组获取权限
   */
  @Get('grouped')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_VIEW)
  async findGrouped() {
    const grouped = await this.permissionService.findGroupedByModule()
    return { data: grouped }
  }

  /**
   * 获取权限统计
   */
  @Get('statistics')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_VIEW)
  async getStatistics() {
    const stats = await this.permissionService.getStatistics()
    return { data: stats }
  }

  /**
   * 获取单个权限
   */
  @Get(':id')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_VIEW)
  async findOne(@Param('id') id: string) {
    const permission = await this.permissionService.findOne(id)
    return { data: permission }
  }

  /**
   * 更新权限
   */
  @Patch(':id')
  @Roles('super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_UPDATE)
  @LogOperation({
    module: 'permission',
    action: 'update',
    resource: 'permission',
    description: '更新权限',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePermissionDto,
  ) {
    const permission = await this.permissionService.update(id, updateDto)
    return {
      message: '权限更新成功',
      data: permission,
    }
  }

  /**
   * 删除权限
   */
  @Delete(':id')
  @Roles('super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_DELETE)
  @LogOperation({
    module: 'permission',
    action: 'delete',
    resource: 'permission',
    description: '删除权限',
  })
  async remove(@Param('id') id: string) {
    await this.permissionService.remove(id)
    return { message: '权限删除成功' }
  }

  /**
   * 验证权限代码
   */
  @Post('validate')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_VIEW)
  async validate(@Body('codes') codes: string[]) {
    const result = await this.permissionService.validatePermissions(codes)
    return { data: result }
  }
}

