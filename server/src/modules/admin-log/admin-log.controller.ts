import {
  Controller,
  Get,
  Query,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AdminLogService } from './admin-log.service'
import { QueryAdminLogDto } from './dto/query-admin-log.dto'
import { RolesGuard } from '../../common/guards/roles.guard'
import { PermissionsGuard } from '../../common/guards/permissions.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { RequirePermissions } from '../../common/decorators/permissions.decorator'
import { PERMISSIONS } from '../../common/constants/permissions'

/**
 * 操作日志控制器
 */
@Controller('admin/logs')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class AdminLogController {
  constructor(private readonly adminLogService: AdminLogService) {}

  /**
   * 获取操作日志列表（分页）
   */
  @Get()
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.SYSTEM_LOGS_VIEW)
  async findAll(@Query() queryDto: QueryAdminLogDto) {
    return await this.adminLogService.findAll(queryDto)
  }

  /**
   * 获取单条日志详情
   */
  @Get(':id')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.SYSTEM_LOGS_VIEW)
  async findOne(@Param('id') id: string) {
    return await this.adminLogService.findOne(id)
  }

  /**
   * 获取操作统计
   */
  @Get('statistics/summary')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.SYSTEM_LOGS_VIEW)
  async getStatistics(@Query('days') days?: number) {
    return await this.adminLogService.getStatistics(
      days ? Number(days) : 30,
    )
  }

  /**
   * 获取最近的操作日志
   */
  @Get('recent/list')
  @Roles('admin', 'super_admin')
  @RequirePermissions(PERMISSIONS.SYSTEM_LOGS_VIEW)
  async getRecentLogs(@Query('limit') limit?: number) {
    return await this.adminLogService.getRecentLogs(
      limit ? Number(limit) : 10,
    )
  }

  /**
   * 删除指定日期之前的日志
   */
  @Delete('cleanup')
  @Roles('super_admin')
  @RequirePermissions(PERMISSIONS.SYSTEM_LOGS_DELETE)
  async cleanup(@Query('before') beforeDate: string) {
    const date = new Date(beforeDate)
    const count = await this.adminLogService.deleteBeforeDate(date)
    return { deletedCount: count }
  }
}

