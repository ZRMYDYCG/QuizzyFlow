import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common'
import { TemplateService } from './template.service'
import { CreateTemplateDto } from './dto/create-template.dto'
import { ApproveTemplateDto } from './dto/approve-template.dto'
import { UpdateTemplateAdminDto } from './dto/update-template-admin.dto'
import { AuthGuard } from '../auth/auth.guard'
import { Public } from '../../common/decorators/public.decorator'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  // 获取模板列表
  @Public()
  @Get()
  async getTemplateList(@Query() query: any) {
    return await this.templateService.getTemplateList(query)
  }

  // 获取精选模板
  @Public()
  @Get('featured')
  async getFeaturedTemplates(@Query('limit') limit: number = 6) {
    return await this.templateService.getFeaturedTemplates(limit)
  }

  // 获取最新模板
  @Public()
  @Get('latest')
  async getLatestTemplates(@Query('limit') limit: number = 6) {
    return await this.templateService.getLatestTemplates(limit)
  }

  // 获取我的模板
  @UseGuards(AuthGuard)
  @Get('my')
  async getMyTemplates(@Request() req, @Query() query: any) {
    const { username } = req.user
    return await this.templateService.getMyTemplates(username, query)
  }

  // 获取模板详情
  @Public()
  @Get(':id')
  async getTemplateDetail(@Param('id') id: string) {
    return await this.templateService.getTemplateDetail(id)
  }

  // 创建模板
  @UseGuards(AuthGuard)
  @Post()
  async createTemplate(@Request() req, @Body() createTemplateDto: CreateTemplateDto) {
    const { username, nickname, sub } = req.user
    // 获取用户完整信息（包含头像）
    const userInfo = await this.templateService.getUserInfo(sub)
    return await this.templateService.createTemplate(
      username, 
      nickname, 
      userInfo.avatar || '',
      createTemplateDto
    )
  }

  // 更新模板
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateTemplate(
    @Request() req,
    @Param('id') id: string,
    @Body() updateData: Partial<CreateTemplateDto>
  ) {
    const { username } = req.user
    return await this.templateService.updateTemplate(id, username, updateData)
  }

  // 删除模板
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTemplate(@Request() req, @Param('id') id: string) {
    const { username } = req.user
    return await this.templateService.deleteTemplate(id, username)
  }

  // 使用模板（增加使用次数）
  @Public()
  @Post(':id/use')
  async useTemplate(@Param('id') id: string) {
    return await this.templateService.incrementUseCount(id)
  }

  // 点赞模板
  @UseGuards(AuthGuard)
  @Post(':id/like')
  async likeTemplate(@Param('id') id: string) {
    return await this.templateService.incrementLikeCount(id)
  }

  // 取消点赞
  @UseGuards(AuthGuard)
  @Delete(':id/like')
  async unlikeTemplate(@Param('id') id: string) {
    return await this.templateService.decrementLikeCount(id)
  }

  // ==================== 管理员接口 ====================

  // 获取所有模板（管理员）
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Get('admin/list')
  async getAdminTemplateList(@Query() query: any) {
    return await this.templateService.getAdminTemplateList(query)
  }

  // 审核模板
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Post('admin/:id/approve')
  async approveTemplate(
    @Request() req,
    @Param('id') id: string,
    @Body() approveDto: ApproveTemplateDto
  ) {
    const { username } = req.user
    return await this.templateService.approveTemplate(
      id,
      approveDto.action,
      username,
      approveDto.reason
    )
  }

  // 设置官方模板
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Patch('admin/:id/official')
  async setOfficial(
    @Param('id') id: string,
    @Body('isOfficial') isOfficial: boolean
  ) {
    return await this.templateService.setOfficial(id, isOfficial)
  }

  // 设置精选模板
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Patch('admin/:id/featured')
  async setFeatured(
    @Param('id') id: string,
    @Body('isFeatured') isFeatured: boolean
  ) {
    return await this.templateService.setFeatured(id, isFeatured)
  }

  // 批量删除模板
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Delete('admin/batch-delete')
  async batchDeleteTemplates(@Body('ids') ids: string[]) {
    return await this.templateService.batchDeleteTemplates(ids)
  }

  // 批量设置精选
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Patch('admin/batch-featured')
  async batchSetFeatured(
    @Body('ids') ids: string[],
    @Body('isFeatured') isFeatured: boolean
  ) {
    return await this.templateService.batchSetFeatured(ids, isFeatured)
  }

  // 获取模板统计
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Get('admin/statistics')
  async getTemplateStatistics() {
    return await this.templateService.getTemplateStatistics()
  }

  // 更新模板（管理员）
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Patch('admin/:id')
  async updateTemplateAdmin(
    @Param('id') id: string,
    @Body() updateDto: UpdateTemplateAdminDto
  ) {
    return await this.templateService.updateTemplateAdmin(id, updateDto)
  }
}

