import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'
import { StatisticsService } from './statistics.service'
import { AuthGuard } from '../auth/auth.guard'

@ApiTags('统计')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  /**
   * 获取问卷的答卷统计列表（表格格式）
   * GET /api/statistics/:questionId
   */
  @ApiOperation({
    summary: '获取问卷答卷统计列表',
    description: '获取问卷的所有答卷数据，用于统计表格展示',
  })
  @ApiParam({
    name: 'questionId',
    description: '问卷ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '页码',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: '每页条数',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
  })
  @Get(':questionId')
  async getAnswerList(
    @Param('questionId') questionId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Request() req,
  ) {
    const { username } = req.user
    return await this.statisticsService.getAnswerList(
      questionId,
      username,
      Number(page),
      Number(pageSize),
    )
  }

  /**
   * 获取单个组件的统计数据（用于图表）
   * GET /api/statistics/:questionId/:componentId
   */
  @ApiOperation({
    summary: '获取单个组件的统计数据',
    description: '获取特定组件的统计数据，用于图表展示',
  })
  @ApiParam({
    name: 'questionId',
    description: '问卷ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiParam({
    name: 'componentId',
    description: '组件ID',
    example: 'c_abc123',
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
  })
  @Get(':questionId/:componentId')
  async getComponentStatistics(
    @Param('questionId') questionId: string,
    @Param('componentId') componentId: string,
    @Request() req,
  ) {
    const { username } = req.user
    return await this.statisticsService.getComponentStatistics(
      questionId,
      componentId,
      username,
    )
  }
}

