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
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger'
import { QuestionService } from './question.service'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import { QueryQuestionDto } from './dto/query-question.dto'
import { BatchDeleteDto } from './dto/batch-delete.dto'
import { Public } from '@/common/decorators/public.decorator'

@ApiTags('问卷')
@ApiBearerAuth()
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  /**
   * 创建新问卷
   * POST /api/question
   */
  @ApiOperation({ summary: '创建新问卷', description: '创建一个新的问卷，可选择提供初始数据' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '问卷创建成功',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createDto?: CreateQuestionDto) {
    const { username } = req.user
    return await this.questionService.create(username, createDto)
  }

  /**
   * 获取问卷列表（支持分页、搜索、筛选）
   * GET /api/question?keyword=xxx&page=1&pageSize=10&isStar=true&isDeleted=false
   */
  @ApiOperation({ 
    summary: '获取问卷列表', 
    description: '支持分页、搜索和筛选功能，可查询普通问卷、标星问卷或已删除问卷' 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功，返回问卷列表和分页信息',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权',
  })
  @Get()
  async findAll(@Request() req, @Query() query: QueryQuestionDto) {
    const { username } = req.user
    return await this.questionService.findAll(username, query)
  }

  /**
   * 获取统计信息
   * GET /api/question/statistics
   */
  @ApiOperation({ 
    summary: '获取问卷统计信息', 
    description: '获取当前用户的问卷统计数据，包括总数、发布数、标星数等' 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权',
  })
  @Get('statistics')
  async getStatistics(@Request() req) {
    const { username } = req.user
    return await this.questionService.getStatistics(username)
  }

  /**
   * 获取单个问卷
   * GET /api/question/:id
   * 已发布的问卷可以公开访问
   */
  @Public()
  @ApiOperation({ 
    summary: '获取单个问卷详情', 
    description: '根据问卷ID获取问卷的详细信息。已发布的问卷无需认证即可访问。' 
  })
  @ApiParam({
    name: 'id',
    description: '问卷ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '问卷不存在',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '无权访问（未发布的问卷）',
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    // req.user 可能不存在（未登录用户）
    const username = req.user?.username
    return await this.questionService.findOne(id, username)
  }

  /**
   * 更新问卷
   * PATCH /api/question/:id
   */
  @ApiOperation({ summary: '更新问卷', description: '更新问卷的信息，包括标题、描述、组件列表等' })
  @ApiParam({
    name: 'id',
    description: '问卷ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '问卷不存在',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdateQuestionDto,
  ) {
    const { username } = req.user
    return await this.questionService.update(id, username, updateDto)
  }

  /**
   * 从回收站恢复
   * PATCH /api/question/:id/restore
   */
  @ApiOperation({ summary: '从回收站恢复问卷', description: '将已删除的问卷从回收站恢复' })
  @ApiParam({
    name: 'id',
    description: '问卷ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '恢复成功',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '问卷不存在',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权',
  })
  @Patch(':id/restore')
  async restore(@Param('id') id: string, @Request() req) {
    const { username } = req.user
    return await this.questionService.restore(id, username)
  }

  /**
   * 批量删除（软删除）
   * DELETE /api/question
   * Body: { ids: ['id1', 'id2'] }
   */
  @ApiOperation({ 
    summary: '批量删除问卷（软删除）', 
    description: '批量删除问卷，移动到回收站，可以恢复' 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '删除成功',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '参数验证失败',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权',
  })
  @Delete()
  @HttpCode(HttpStatus.OK)
  async batchDelete(@Request() req, @Body() batchDeleteDto: BatchDeleteDto) {
    const { username } = req.user
    return await this.questionService.batchDelete(
      batchDeleteDto.ids,
      username,
    )
  }

  /**
   * 永久删除
   * DELETE /api/question/:id/permanent
   */
  @ApiOperation({ 
    summary: '永久删除问卷', 
    description: '彻底删除问卷，无法恢复' 
  })
  @ApiParam({
    name: 'id',
    description: '问卷ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '永久删除成功',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '问卷不存在',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权',
  })
  @Delete(':id/permanent')
  @HttpCode(HttpStatus.OK)
  async permanentDelete(@Param('id') id: string, @Request() req) {
    const { username } = req.user
    return await this.questionService.permanentDelete(id, username)
  }

  /**
   * 复制问卷
   * POST /api/question/duplicate/:id
   */
  @ApiOperation({ 
    summary: '复制问卷', 
    description: '复制一个已存在的问卷，创建副本' 
  })
  @ApiParam({
    name: 'id',
    description: '要复制的问卷ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '复制成功，返回新问卷信息',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '源问卷不存在',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权',
  })
  @Post('duplicate/:id')
  async duplicate(@Param('id') id: string, @Request() req) {
    const { username } = req.user
    return await this.questionService.duplicate(id, username)
  }
}
