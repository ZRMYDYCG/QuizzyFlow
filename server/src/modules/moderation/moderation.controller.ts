import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { ModerationService } from './moderation.service'
import { QueryModerationDto } from './dto/query-moderation.dto'
import { ReviewContentDto } from './dto/review-content.dto'
import { BatchReviewDto } from './dto/batch-review.dto'
import { CreateSensitiveWordDto } from './dto/create-sensitive-word.dto'
import { AuthGuard } from '../auth/auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@ApiTags('内容审核')
@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  /**
   * 获取待审核队列（管理员）
   * GET /api/moderation/queue
   */
  @ApiOperation({
    summary: '获取待审核队列',
    description: '管理员查看待审核的内容列表',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Get('queue')
  async getPendingQueue(@Query() query: QueryModerationDto) {
    return await this.moderationService.getPendingQueue(query)
  }

  /**
   * 审核内容（管理员）
   * POST /api/moderation/:id/review
   */
  @ApiOperation({
    summary: '审核内容',
    description: '管理员审核内容（通过/拒绝）',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Post(':id/review')
  @HttpCode(HttpStatus.OK)
  async reviewContent(
    @Param('id') id: string,
    @Body() reviewDto: ReviewContentDto,
    @Request() req,
  ) {
    const { username } = req.user
    return await this.moderationService.reviewContent(id, reviewDto, username)
  }

  /**
   * 批量审核（管理员）
   * POST /api/moderation/batch-review
   */
  @ApiOperation({
    summary: '批量审核',
    description: '管理员批量审核内容',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Post('batch-review')
  @HttpCode(HttpStatus.OK)
  async batchReview(@Body() batchDto: BatchReviewDto, @Request() req) {
    const { username } = req.user
    return await this.moderationService.batchReview(batchDto, username)
  }

  /**
   * 获取审核统计（管理员）
   * GET /api/moderation/statistics
   */
  @ApiOperation({
    summary: '获取审核统计',
    description: '管理员查看审核统计数据',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Get('statistics')
  async getStatistics() {
    return await this.moderationService.getStatistics()
  }

  // ==================== 敏感词管理 ====================

  /**
   * 获取敏感词列表（管理员）
   * GET /api/moderation/sensitive-words
   */
  @ApiOperation({
    summary: '获取敏感词列表',
    description: '管理员查看敏感词列表',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Get('sensitive-words')
  async getSensitiveWords(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return await this.moderationService.getSensitiveWords(page, pageSize)
  }

  /**
   * 添加敏感词（管理员）
   * POST /api/moderation/sensitive-words
   */
  @ApiOperation({
    summary: '添加敏感词',
    description: '管理员添加敏感词',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Post('sensitive-words')
  async addSensitiveWord(
    @Body() dto: CreateSensitiveWordDto,
    @Request() req,
  ) {
    const { username } = req.user
    return await this.moderationService.addSensitiveWord(dto, username)
  }

  /**
   * 删除敏感词（管理员）
   * DELETE /api/moderation/sensitive-words/:id
   */
  @ApiOperation({
    summary: '删除敏感词',
    description: '管理员删除敏感词',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Delete('sensitive-words/:id')
  @HttpCode(HttpStatus.OK)
  async deleteSensitiveWord(@Param('id') id: string) {
    return await this.moderationService.deleteSensitiveWord(id)
  }

  /**
   * 批量导入敏感词（管理员）
   * POST /api/moderation/sensitive-words/batch-import
   */
  @ApiOperation({
    summary: '批量导入敏感词',
    description: '管理员批量导入敏感词',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Post('sensitive-words/batch-import')
  @HttpCode(HttpStatus.OK)
  async batchImportSensitiveWords(
    @Body() body: { words: CreateSensitiveWordDto[] },
    @Request() req,
  ) {
    const { username } = req.user
    return await this.moderationService.batchImportSensitiveWords(
      body.words,
      username,
    )
  }
}

