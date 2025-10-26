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
  Res,
  Sse,
} from '@nestjs/common'
import { Response } from 'express'
import { AIChatService } from './ai-chat.service'
import { AIChatProxyService } from './ai-chat-proxy.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { AddMessageDto } from './dto/add-message.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { QueryChatDto } from './dto/query-chat.dto'

@Controller('ai-chat')
export class AIChatController {
  constructor(
    private readonly aiChatService: AIChatService,
    private readonly aiChatProxyService: AIChatProxyService,
  ) {}

  /**
   * 文本 AI 处理（续写、润色、翻译等）
   * POST /api/ai-chat/text
   */
  @Post('text')
  async processText(
    @Body() body: { messages: Array<{ role: string; content: string }> },
  ) {
    // 直接返回数据，TransformInterceptor 会自动包装成 { errno: 0, data: ... }
    const result = await this.aiChatProxyService.chat(body.messages as any)
    return {
      result,
      content: result,
    }
  }

  /**
   * 流式 AI 对话（代理硅基流动 API）
   * POST /api/ai-chat/stream
   */
  @Post('stream')
  async stream(
    @Body() body: { messages: Array<{ role: string; content: string }> },
    @Res() res: Response,
  ) {
    try {
      const stream = await this.aiChatProxyService.streamChat(body.messages as any)

      // 设置 SSE 响应头
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      // 创建可读流的迭代器
      const reader = stream.getReader()
      const decoder = new TextDecoder()

      try {
        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            res.write('data: [DONE]\n\n')
            res.end()
            break
          }

          // 转发数据到前端
          const chunk = decoder.decode(value, { stream: true })
          res.write(chunk)
        }
      } catch (error) {
        console.error('Stream error:', error)
        res.end()
      }
    } catch (error) {
      console.error('AI stream error:', error)
      res.status(500).json({
        message: 'AI 服务异常',
        error: error.message,
      })
    }
  }

  /**
   * 创建新的对话会话
   * POST /api/ai-chat
   */
  @Post()
  async create(@Request() req, @Body() createChatDto: CreateChatDto) {
    const { username } = req.user
    return await this.aiChatService.create(username, createChatDto)
  }

  /**
   * 获取指定问卷的对话列表
   * GET /api/ai-chat/question/:questionId
   */
  @Get('question/:questionId')
  async findByQuestion(
    @Request() req,
    @Param('questionId') questionId: string,
    @Query() queryDto: QueryChatDto,
  ) {
    const { username } = req.user
    return await this.aiChatService.findByQuestion(username, questionId, queryDto)
  }

  /**
   * 获取指定问卷的最近一次对话（自动恢复用）
   * GET /api/ai-chat/question/:questionId/latest
   */
  @Get('question/:questionId/latest')
  async getLatest(@Request() req, @Param('questionId') questionId: string) {
    const { username } = req.user
    return await this.aiChatService.getLatest(username, questionId)
  }

  /**
   * 获取对话详情
   * GET /api/ai-chat/:id
   */
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const { username } = req.user
    return await this.aiChatService.findOne(id, username)
  }

  /**
   * 添加消息到对话
   * POST /api/ai-chat/:id/message
   */
  @Post(':id/message')
  async addMessage(
    @Request() req,
    @Param('id') id: string,
    @Body() messageDto: AddMessageDto,
  ) {
    const { username } = req.user
    return await this.aiChatService.addMessage(id, username, messageDto)
  }

  /**
   * 批量添加消息
   * POST /api/ai-chat/:id/messages/batch
   */
  @Post(':id/messages/batch')
  async batchAddMessages(
    @Request() req,
    @Param('id') id: string,
    @Body() messages: AddMessageDto[],
  ) {
    const { username } = req.user
    return await this.aiChatService.batchAddMessages(id, username, messages)
  }

  /**
   * 同步消息（覆盖式更新）
   * PUT /api/ai-chat/:id/messages/sync
   */
  @Patch(':id/messages/sync')
  async syncMessages(
    @Request() req,
    @Param('id') id: string,
    @Body() messages: AddMessageDto[],
  ) {
    const { username } = req.user
    return await this.aiChatService.syncMessages(id, username, messages)
  }

  /**
   * 更新对话信息
   * PATCH /api/ai-chat/:id
   */
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateChatDto,
  ) {
    const { username } = req.user
    return await this.aiChatService.update(id, username, updateDto)
  }

  /**
   * 删除对话
   * DELETE /api/ai-chat/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Request() req, @Param('id') id: string) {
    const { username } = req.user
    return await this.aiChatService.remove(id, username)
  }

  /**
   * 清空指定问卷的所有对话
   * DELETE /api/ai-chat/question/:questionId/clear
   */
  @Delete('question/:questionId/clear')
  @HttpCode(HttpStatus.OK)
  async clearByQuestion(@Request() req, @Param('questionId') questionId: string) {
    const { username } = req.user
    return await this.aiChatService.clearByQuestion(username, questionId)
  }
}

