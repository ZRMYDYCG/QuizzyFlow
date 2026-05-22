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
  BadRequestException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { pipeAgentUIStreamToResponse } from 'ai'
import { AIChatService } from './ai-chat.service'
import { AIChatProxyService } from './ai-chat-proxy.service'
import { QuestionnaireAgentService } from './questionnaire-agent.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { AddMessageDto } from './dto/add-message.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { QueryChatDto } from './dto/query-chat.dto'
import { AgentChatDto } from './dto/agent-chat.dto'
import { SyncMessagesDto } from './dto/sync-messages.dto'
import { ProcessTextDto } from './dto/process-text.dto'
import { buildTextAIMessages } from './prompts/text-ai-prompt'
import { getMaterialLibraryJSON } from './shared/material-library'
import { QUESTION_COMPONENT_JSON_SCHEMA } from './shared/component-template.schema'
import { listSkillCatalog } from './skills/skill-registry'

@ApiTags('AI 助手')
@Controller('ai-chat')
export class AIChatController {
  constructor(
    private readonly aiChatService: AIChatService,
    private readonly aiChatProxyService: AIChatProxyService,
    private readonly questionnaireAgentService: QuestionnaireAgentService,
  ) {}

  /**
   * 物料库与 JSON Schema（供前端/调试）
   * GET /api/ai-chat/schema
   */
  @Get('schema')
  getSchema() {
    return {
      componentJsonSchema: QUESTION_COMPONENT_JSON_SCHEMA,
      materialLibrary: JSON.parse(getMaterialLibraryJSON()),
    }
  }

  /**
   * Skill 目录（供前端展示 tool 名称映射）
   * GET /api/ai-chat/skills
   */
  @Get('skills')
  getSkills() {
    return { skills: listSkillCatalog() }
  }

  /**
   * Vercel AI SDK Agent + AG-UI 流式对话
   * POST /api/ai-chat/agent
   */
  @Post('agent')
  async agentStream(
    @Body() body: AgentChatDto,
    @Res() res: Response,
  ) {
    try {
      const uiMessages = body.uiMessages ?? body.messages ?? []
      const agent = this.questionnaireAgentService.getAgent(body.context)

      await pipeAgentUIStreamToResponse({
        response: res,
        agent,
        uiMessages,
      })
    } catch (error) {
      console.error('AI agent stream error:', error)
      if (!res.headersSent) {
        res.status(500).json({
          message: 'AI Agent 服务异常',
          error: error.message,
        })
      }
    }
  }

  /**
   * 文本 AI 处理（续写、润色、翻译等）
   * POST /api/ai-chat/text
   */
  @Post('text')
  async processText(@Body() dto: ProcessTextDto) {
    const text = dto.text?.trim()
    if (!text) {
      throw new BadRequestException('text 不能为空')
    }

    if (dto.action === 'translate' && !dto.targetLanguage) {
      throw new BadRequestException('翻译需指定目标语言 targetLanguage')
    }

    const messages = buildTextAIMessages(
      dto.action,
      text,
      dto.context,
      dto.targetLanguage,
    )
    const result = await this.aiChatProxyService.chat(messages)
    return {
      result: result.trim(),
      content: result.trim(),
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
   * 标记操作为已应用（须在 :id/messages/sync 之前注册，避免路由冲突）
   * PATCH /api/ai-chat/:id/messages/:messageId/actions/:actionId/apply
   */
  @Patch(':id/messages/:messageId/actions/:actionId/apply')
  async applyAction(
    @Request() req,
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Param('actionId') actionId: string,
  ) {
    const { username } = req.user
    return await this.aiChatService.markActionApplied(
      id,
      username,
      messageId,
      actionId,
    )
  }

  /**
   * 同步消息（覆盖式更新）
   * PATCH /api/ai-chat/:id/messages/sync
   */
  @Patch(':id/messages/sync')
  async syncMessages(
    @Request() req,
    @Param('id') id: string,
    @Body() body: SyncMessagesDto | AddMessageDto[],
  ) {
    const { username } = req.user
    const messages = Array.isArray(body) ? body : body.messages
    return await this.aiChatService.syncMessages(id, username, messages)
  }

  /**
   * 标记会话为最近打开
   * PATCH /api/ai-chat/:id/open
   */
  @Patch(':id/open')
  async markOpened(@Request() req, @Param('id') id: string) {
    const { username } = req.user
    return await this.aiChatService.markOpened(id, username)
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

