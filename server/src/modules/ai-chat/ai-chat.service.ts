import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AIChat, AIChatDocument, ChatMessage } from './schemas/ai-chat.schema'
import { CreateChatDto } from './dto/create-chat.dto'
import { AddMessageDto } from './dto/add-message.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { QueryChatDto } from './dto/query-chat.dto'
import {
  normalizeMessagesForDb,
  serializeChatForClient,
} from './utils/message-normalizer'

@Injectable()
export class AIChatService {
  constructor(
    @InjectModel(AIChat.name) private aiChatModel: Model<AIChatDocument>,
  ) {}

  private async findOneDocument(
    id: string,
    username: string,
  ): Promise<AIChatDocument> {
    const chat = await this.aiChatModel.findOne({
      _id: id,
      isDeleted: false,
    })

    if (!chat) {
      throw new NotFoundException('对话不存在')
    }

    if (chat.author !== username) {
      throw new ForbiddenException('无权访问此对话')
    }

    return chat
  }

  private normalizeSingleMessage(dto: AddMessageDto): ChatMessage {
    const [msg] = normalizeMessagesForDb([dto])
    return msg
  }

  /**
   * 创建新的对话会话
   */
  async create(username: string, createChatDto: CreateChatDto) {
    const { questionId, title } = createChatDto
    const chatTitle = title?.trim() || '未命名'

    const chat = await this.aiChatModel.create({
      questionId,
      author: username,
      title: chatTitle,
      messages: [],
      lastMessageAt: new Date(),
    })

    return serializeChatForClient(chat)
  }

  /**
   * 获取指定问卷的对话列表
   */
  async findByQuestion(username: string, questionId: string, queryDto: QueryChatDto) {
    const page = parseInt(queryDto.page || '1', 10)
    const pageSize = parseInt(queryDto.pageSize || '10', 10)
    const skip = (page - 1) * pageSize

    const query = {
      author: username,
      questionId,
      isDeleted: false,
    }

    const [chats, total] = await Promise.all([
      this.aiChatModel
        .find(query)
        .sort({ lastMessageAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .select('-messages')
        .exec(),
      this.aiChatModel.countDocuments(query),
    ])

    return {
      list: chats,
      total,
      page,
      pageSize,
    }
  }

  /**
   * 获取指定对话的详情（包含所有消息）
   */
  async findOne(id: string, username: string) {
    const chat = await this.findOneDocument(id, username)
    return serializeChatForClient(chat)
  }

  /**
   * 添加消息到对话
   */
  async addMessage(id: string, username: string, messageDto: AddMessageDto) {
    const chat = await this.findOneDocument(id, username)

    chat.messages.push(this.normalizeSingleMessage(messageDto))
    chat.lastMessageAt = new Date()

    await chat.save()

    return serializeChatForClient(chat)
  }

  /**
   * 批量添加消息（用于同步整个对话）
   */
  async batchAddMessages(id: string, username: string, messages: AddMessageDto[]) {
    const chat = await this.findOneDocument(id, username)

    chat.messages.push(...normalizeMessagesForDb(messages))
    chat.lastMessageAt = new Date()

    await chat.save()

    return serializeChatForClient(chat)
  }

  /**
   * 更新对话信息（如标题）
   */
  async update(id: string, username: string, updateDto: UpdateChatDto) {
    const chat = await this.findOneDocument(id, username)

    if (updateDto.title) {
      chat.title = updateDto.title
    }

    await chat.save()

    return serializeChatForClient(chat)
  }

  /**
   * 删除对话（软删除）
   */
  async remove(id: string, username: string) {
    const chat = await this.findOneDocument(id, username)

    chat.isDeleted = true
    chat.deletedAt = new Date()

    await chat.save()

    return { message: '删除成功' }
  }

  /**
   * 清空指定问卷的所有对话
   */
  async clearByQuestion(username: string, questionId: string) {
    await this.aiChatModel.updateMany(
      {
        author: username,
        questionId,
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
    )

    return { message: '清空成功' }
  }

  /**
   * 获取最近的对话（用于自动恢复）
   */
  async getLatest(username: string, questionId: string) {
    const chat = await this.aiChatModel
      .findOne({
        author: username,
        questionId,
        isDeleted: false,
      })
      .sort({ lastMessageAt: -1 })
      .exec()

    return chat ? serializeChatForClient(chat) : chat
  }

  /**
   * 同步对话消息（覆盖式更新）
   */
  async syncMessages(id: string, username: string, messages: AddMessageDto[]) {
    const chat = await this.findOneDocument(id, username)

    chat.messages = normalizeMessagesForDb(messages)
    chat.lastMessageAt = new Date()

    await chat.save()

    return serializeChatForClient(chat)
  }

  /**
   * 标记某条消息下的操作为已应用
   */
  async markActionApplied(
    id: string,
    username: string,
    messageId: string,
    actionId: string,
  ) {
    const chat = await this.findOneDocument(id, username)

    const message = chat.messages.find((m) => m.id === messageId)
    if (!message) {
      throw new NotFoundException('消息不存在')
    }

    if (!message.actions?.length) {
      throw new NotFoundException('该消息没有可应用的操作')
    }

    const action = message.actions.find((a) => a.actionId === actionId)
    if (!action) {
      throw new NotFoundException('操作不存在')
    }

    if (!action.applied) {
      action.applied = true
      action.appliedAt = Date.now()
      chat.markModified('messages')
      await chat.save()
    }

    return serializeChatForClient(chat)
  }
}
