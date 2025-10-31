import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SystemConfigService } from './system-config.service'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import {
  UpdateConfigItemDto,
  BatchUpdateConfigDto,
} from './dto/update-config.dto'
import { QueryConfigDto } from './dto/query-config.dto'

@ApiTags('系统配置')
@Controller('admin/system-config')
export class SystemConfigController {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  /**
   * 初始化默认配置（仅开发环境使用）
   */
  @Post('initialize')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin')
  async initializeDefaultConfig() {
    return await this.systemConfigService.initializeDefaultConfig()
  }

  /**
   * 获取所有配置（按分类分组）
   */
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin', 'admin')
  async getAllConfigs(@Query() query: QueryConfigDto) {
    return await this.systemConfigService.getAllConfigs(query)
  }

  /**
   * 获取公开配置（前端使用，无需认证）
   */
  @Get('public')
  async getPublicConfigs() {
    return await this.systemConfigService.getPublicConfigs()
  }

  /**
   * 获取指定分类的配置
   */
  @Get('category/:category')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin', 'admin')
  async getConfigsByCategory(@Param('category') category: string) {
    return await this.systemConfigService.getConfigsByCategory(category)
  }

  /**
   * 获取单个配置
   */
  @Get(':key')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin', 'admin')
  async getConfigByKey(@Param('key') key: string) {
    return await this.systemConfigService.getConfigByKey(key)
  }

  /**
   * 更新单个配置
   */
  @Patch(':key')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin', 'admin')
  @HttpCode(HttpStatus.OK)
  async updateConfig(
    @Param('key') key: string,
    @Body() updateDto: UpdateConfigItemDto,
    @Request() req,
  ) {
    const username = req.user?.username || 'system'
    return await this.systemConfigService.updateConfig(key, updateDto, username)
  }

  /**
   * 批量更新配置
   */
  @Patch('batch')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin', 'admin')
  @HttpCode(HttpStatus.OK)
  async batchUpdateConfigs(@Body() batchDto: BatchUpdateConfigDto, @Request() req) {
    const username = req.user?.username || 'system'
    return await this.systemConfigService.batchUpdateConfigs(batchDto, username)
  }

  /**
   * 重置配置为默认值
   */
  @Post(':key/reset')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin')
  async resetConfig(@Param('key') key: string) {
    return await this.systemConfigService.resetConfig(key)
  }
}

