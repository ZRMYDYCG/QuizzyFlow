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
    return await this.permissionService.initializeSystemPermissions()
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
    return await this.permissionService.create(
      createDto,
      req.user.username,
    )
  }

  /**
   * 获取所有权限
   */
  @Get()
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_VIEW)
  async findAll(@Query() queryDto: QueryPermissionDto) {
    return await this.permissionService.findAll(queryDto)
  }

  /**
   * 按模块分组获取权限
   */
  @Get('grouped')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_VIEW)
  async findGrouped() {
    return await this.permissionService.findGroupedByModule()
  }

  /**
   * 获取权限统计
   */
  @Get('statistics')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_VIEW)
  async getStatistics() {
    return await this.permissionService.getStatistics()
  }

  /**
   * 获取单个权限
   */
  @Get(':id')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_VIEW)
  async findOne(@Param('id') id: string) {
    return await this.permissionService.findOne(id)
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
    return await this.permissionService.update(id, updateDto)
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
    return await this.permissionService.remove(id)
  }

  /**
   * 验证权限代码
   */
  @Post('validate')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.PERMISSION_VIEW)
  async validate(@Body('codes') codes: string[]) {
    return await this.permissionService.validatePermissions(codes)
  }
}

