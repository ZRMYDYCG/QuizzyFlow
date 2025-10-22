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
import { QuestionService } from './question.service'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import { QueryQuestionDto } from './dto/query-question.dto'
import { BatchDeleteDto } from './dto/batch-delete.dto'

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  /**
   * 创建新问卷
   * POST /api/question
   */
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
  @Get()
  async findAll(@Request() req, @Query() query: QueryQuestionDto) {
    const { username } = req.user
    return await this.questionService.findAll(username, query)
  }

  /**
   * 获取统计信息
   * GET /api/question/statistics
   */
  @Get('statistics')
  async getStatistics(@Request() req) {
    const { username } = req.user
    return await this.questionService.getStatistics(username)
  }

  /**
   * 获取单个问卷
   * GET /api/question/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const { username } = req.user
    return await this.questionService.findOne(id, username)
  }

  /**
   * 更新问卷
   * PATCH /api/question/:id
   */
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
  @Post('duplicate/:id')
  async duplicate(@Param('id') id: string, @Request() req) {
    const { username } = req.user
    return await this.questionService.duplicate(id, username)
  }
}
