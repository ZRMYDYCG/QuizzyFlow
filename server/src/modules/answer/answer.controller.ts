import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  Request,
  HttpCode,
  HttpStatus,
  Ip,
  Headers,
  UseGuards,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger'
import { AnswerService } from './answer.service'
import { CreateAnswerDto } from './dto/create-answer.dto'
import { QueryAnswerDto } from './dto/query-answer.dto'
import { QueryAnswerAdminDto } from './dto/query-answer-admin.dto'
import { BatchDeleteAnswerDto } from './dto/batch-delete-answer.dto'
import { MarkAnswerDto } from './dto/mark-answer.dto'
import { AuthGuard } from '../auth/auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@ApiTags('答卷')
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  /**
   * 提交答卷（无需认证）
   * POST /api/answer
   */
  @ApiOperation({
    summary: '提交答卷',
    description: '用户填写问卷后提交答案，无需登录',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '提交成功',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '问卷未发布或数据验证失败',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateAnswerDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return await this.answerService.create(createDto, ip, userAgent)
  }

  /**
   * 获取问卷的答卷列表（需要认证）
   * GET /api/answer?questionId=xxx&page=1&pageSize=10
   */
  @ApiOperation({
    summary: '获取问卷的答卷列表',
    description: '问卷作者可以查看自己问卷的所有答卷',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req, @Query() query: QueryAnswerDto) {
    const { username } = req.user
    return await this.answerService.findAll(username, query)
  }

  /**
   * 获取单个答卷详情（需要认证）
   * GET /api/answer/:id
   */
  @ApiOperation({
    summary: '获取单个答卷详情',
    description: '问卷作者可以查看答卷的详细信息',
  })
  @ApiParam({
    name: 'id',
    description: '答卷ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '答卷不存在',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const { username } = req.user
    return await this.answerService.findOne(id, username)
  }

  /**
   * 删除答卷（需要认证）
   * DELETE /api/answer/:id
   */
  @ApiOperation({
    summary: '删除答卷',
    description: '问卷作者可以删除答卷',
  })
  @ApiParam({
    name: 'id',
    description: '答卷ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '删除成功',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '答卷不存在',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Request() req) {
    const { username } = req.user
    return await this.answerService.remove(id, username)
  }

  // ==================== 管理员接口 ====================

  /**
   * 获取所有答卷列表（管理员）
   * GET /api/answer/admin/list
   */
  @ApiOperation({
    summary: '获取所有答卷列表（管理员）',
    description: '管理员查看所有答卷，支持多种筛选条件',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Get('admin/list')
  async findAllAdmin(@Query() query: QueryAnswerAdminDto) {
    return await this.answerService.findAllAdmin(query)
  }

  /**
   * 标记答卷（管理员）
   * PATCH /api/answer/admin/:id/mark
   */
  @ApiOperation({
    summary: '标记答卷',
    description: '管理员标记答卷为正常或异常',
  })
  @ApiParam({
    name: 'id',
    description: '答卷ID',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Patch('admin/:id/mark')
  async markAnswer(@Param('id') id: string, @Body() markDto: MarkAnswerDto) {
    return await this.answerService.markAnswer(id, markDto)
  }

  /**
   * 批量删除答卷（管理员）
   * DELETE /api/answer/admin/batch-delete
   */
  @ApiOperation({
    summary: '批量删除答卷',
    description: '管理员批量删除答卷',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Delete('admin/batch-delete')
  @HttpCode(HttpStatus.OK)
  async batchDeleteAnswers(@Body() batchDeleteDto: BatchDeleteAnswerDto) {
    return await this.answerService.batchDeleteAnswers(batchDeleteDto)
  }

  /**
   * 获取答卷统计数据（管理员）
   * GET /api/answer/admin/statistics
   */
  @ApiOperation({
    summary: '获取答卷统计数据',
    description: '管理员查看答卷统计数据',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Get('admin/statistics')
  async getStatistics() {
    return await this.answerService.getStatistics()
  }

  /**
   * 导出答卷数据（管理员）
   * GET /api/answer/admin/export
   */
  @ApiOperation({
    summary: '导出答卷数据',
    description: '管理员导出答卷数据（返回JSON格式，前端处理成Excel）',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Get('admin/export')
  async exportAnswers(@Query() query: QueryAnswerAdminDto) {
    return await this.answerService.exportAnswers(query)
  }
}

