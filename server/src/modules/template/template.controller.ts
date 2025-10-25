import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common'
import { TemplateService } from './template.service'
import { CreateTemplateDto } from './dto/create-template.dto'
import { AuthGuard } from '../auth/auth.guard'
import { Public } from '../../common/decorators/public.decorator'

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
    const { username, nickname } = req.user
    return await this.templateService.createTemplate(username, nickname, createTemplateDto)
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
}

