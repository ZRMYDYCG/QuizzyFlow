import {
  Controller,
  Get,
  Post,
  Patch,
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
import { FeedbackService } from './feedback.service'
import { CreateFeedbackDto } from './dto/create-feedback.dto'
import { UpdateFeedbackDto } from './dto/update-feedback.dto'
import { ReplyFeedbackDto } from './dto/reply-feedback.dto'
import { QueryFeedbackDto } from './dto/query-feedback.dto'
import { AuthGuard } from '../auth/auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@ApiTags('反馈管理')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  /**
   * 创建反馈（需要登录）
   * POST /api/feedback
   */
  @ApiOperation({
    summary: '提交反馈',
    description: '用户提交Bug报告、功能请求或其他反馈',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createDto: CreateFeedbackDto, @Request() req) {
    const { username } = req.user
    return await this.feedbackService.create(createDto, username)
  }

  /**
   * 获取反馈列表（管理员）
   * GET /api/feedback/admin/list
   */
  @ApiOperation({
    summary: '获取反馈列表',
    description: '管理员查看所有反馈',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Get('admin/list')
  async findAll(@Query() query: QueryFeedbackDto) {
    return await this.feedbackService.findAll(query)
  }

  /**
   * 获取反馈详情
   * GET /api/feedback/:id
   */
  @ApiOperation({
    summary: '获取反馈详情',
    description: '查看单个反馈的详细信息',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.feedbackService.findOne(id)
  }

  /**
   * 更新反馈（管理员）
   * PATCH /api/feedback/admin/:id
   */
  @ApiOperation({
    summary: '更新反馈',
    description: '管理员更新反馈状态、优先级等',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Patch('admin/:id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateFeedbackDto,
    @Request() req,
  ) {
    const { username } = req.user
    return await this.feedbackService.update(id, updateDto, username)
  }

  /**
   * 回复反馈
   * POST /api/feedback/:id/reply
   */
  @ApiOperation({
    summary: '回复反馈',
    description: '管理员或用户回复反馈',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post(':id/reply')
  @HttpCode(HttpStatus.OK)
  async reply(
    @Param('id') id: string,
    @Body() replyDto: ReplyFeedbackDto,
    @Request() req,
  ) {
    const { username } = req.user
    return await this.feedbackService.reply(id, replyDto, username)
  }

  /**
   * 投票（功能请求）
   * POST /api/feedback/:id/vote
   */
  @ApiOperation({
    summary: '投票',
    description: '为功能请求投票',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post(':id/vote')
  @HttpCode(HttpStatus.OK)
  async vote(@Param('id') id: string, @Request() req) {
    const { username } = req.user
    return await this.feedbackService.vote(id, username)
  }

  /**
   * 取消投票
   * POST /api/feedback/:id/unvote
   */
  @ApiOperation({
    summary: '取消投票',
    description: '取消为功能请求投票',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post(':id/unvote')
  @HttpCode(HttpStatus.OK)
  async unvote(@Param('id') id: string, @Request() req) {
    const { username } = req.user
    return await this.feedbackService.unvote(id, username)
  }

  /**
   * 删除反馈（管理员）
   * DELETE /api/feedback/admin/:id
   */
  @ApiOperation({
    summary: '删除反馈',
    description: '管理员删除反馈',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Delete('admin/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.feedbackService.remove(id)
  }

  /**
   * 获取统计数据（管理员）
   * GET /api/feedback/admin/statistics
   */
  @ApiOperation({
    summary: '获取统计数据',
    description: '管理员查看反馈统计',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Get('admin/statistics')
  async getStatistics() {
    return await this.feedbackService.getStatistics()
  }
}

