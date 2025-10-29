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
import { FlowService } from './flow.service'
import { CreateFlowDto } from './dto/create-flow.dto'
import { UpdateFlowDto } from './dto/update-flow.dto'
import { QueryFlowDto } from './dto/query-flow.dto'
import { BatchDeleteDto } from './dto/batch-delete-flow.dto'

@ApiTags('工作流')
@ApiBearerAuth()
@Controller('flow')
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  @ApiOperation({ summary: '创建工作流' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '创建成功' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createDto?: CreateFlowDto) {
    const { username } = req.user
    return await this.flowService.create(username, createDto)
  }

  @ApiOperation({ summary: '获取工作流列表' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取成功' })
  @Get()
  async findAll(@Request() req, @Query() query: QueryFlowDto) {
    const { username } = req.user
    return await this.flowService.findAll(username, query)
  }

  @ApiOperation({ summary: '获取统计信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取成功' })
  @Get('statistics')
  async getStatistics(@Request() req) {
    const { username } = req.user
    return await this.flowService.getStatistics(username)
  }

  @ApiOperation({ summary: '获取单个工作流' })
  @ApiParam({ name: 'id', description: '工作流ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '工作流不存在' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const { username } = req.user
    return await this.flowService.findOne(id, username)
  }

  @ApiOperation({ summary: '更新工作流' })
  @ApiParam({ name: 'id', description: '工作流ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '更新成功' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdateFlowDto,
  ) {
    const { username } = req.user
    return await this.flowService.update(id, username, updateDto)
  }

  @ApiOperation({ summary: '批量删除工作流（软删除）' })
  @ApiResponse({ status: HttpStatus.OK, description: '删除成功' })
  @Delete()
  @HttpCode(HttpStatus.OK)
  async batchDelete(@Request() req, @Body() batchDeleteDto: BatchDeleteDto) {
    const { username } = req.user
    return await this.flowService.batchDelete(batchDeleteDto.ids, username)
  }

  @ApiOperation({ summary: '从回收站恢复' })
  @ApiParam({ name: 'id', description: '工作流ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '恢复成功' })
  @Patch(':id/restore')
  async restore(@Param('id') id: string, @Request() req) {
    const { username } = req.user
    return await this.flowService.restore(id, username)
  }

  @ApiOperation({ summary: '永久删除' })
  @ApiParam({ name: 'id', description: '工作流ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '永久删除成功' })
  @Delete(':id/permanent')
  @HttpCode(HttpStatus.OK)
  async permanentDelete(@Param('id') id: string, @Request() req) {
    const { username } = req.user
    return await this.flowService.permanentDelete(id, username)
  }

  @ApiOperation({ summary: '复制工作流' })
  @ApiParam({ name: 'id', description: '要复制的工作流ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '复制成功' })
  @Post('duplicate/:id')
  async duplicate(@Param('id') id: string, @Request() req) {
    const { username } = req.user
    return await this.flowService.duplicate(id, username)
  }

  @ApiOperation({ summary: '更新缩略图' })
  @ApiParam({ name: 'id', description: '工作流ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '更新成功' })
  @Post(':id/thumbnail')
  async updateThumbnail(
    @Param('id') id: string,
    @Body('thumbnail') thumbnail: string,
  ) {
    return await this.flowService.updateThumbnail(id, thumbnail)
  }
}

