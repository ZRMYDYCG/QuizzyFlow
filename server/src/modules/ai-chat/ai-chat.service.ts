import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AIChat, AIChatDocument } from './schemas/ai-chat.schema'
import { CreateChatDto } from './dto/create-chat.dto'
import { AddMessageDto } from './dto/add-message.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { QueryChatDto } from './dto/query-chat.dto'

@Injectable()
export class AIChatService {
  constructor(
    @InjectModel(AIChat.name) private aiChatModel: Model<AIChatDocument>,
  ) {}

  /**
   * 创建新的对话会话
   */
  async create(username: string, createChatDto: CreateChatDto) {
    const { questionId, title } = createChatDto

    // 生成默认标题（如果没有提供）
    const chatTitle = title || `AI 对话 - ${new Date().toLocaleString('zh-CN')}`

    const chat = await this.aiChatModel.create({
      questionId,
      author: username,
      title: chatTitle,
      messages: [],
      lastMessageAt: new Date(),
    })

    return chat
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
        .select('-messages') // 列表不返回消息内容，减少数据量
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
    const chat = await this.aiChatModel.findOne({
      _id: id,
      isDeleted: false,
    })

    if (!chat) {
      throw new NotFoundException('对话不存在')
    }

    // 验证权限
    if (chat.author !== username) {
      throw new ForbiddenException('无权访问此对话')
    }

    return chat
  }

  /**
   * 添加消息到对话
   */
  async addMessage(id: string, username: string, messageDto: AddMessageDto) {
    const chat = await this.findOne(id, username)

    // 添加消息
    chat.messages.push(messageDto as any)
    chat.lastMessageAt = new Date()

    await chat.save()

    return chat
  }

  /**
   * 批量添加消息（用于同步整个对话）
   */
  async batchAddMessages(id: string, username: string, messages: AddMessageDto[]) {
    const chat = await this.findOne(id, username)

    // 添加所有消息
    chat.messages.push(...(messages as any))
    chat.lastMessageAt = new Date()

    await chat.save()

    return chat
  }

  /**
   * 更新对话信息（如标题）
   */
  async update(id: string, username: string, updateDto: UpdateChatDto) {
    const chat = await this.findOne(id, username)

    if (updateDto.title) {
      chat.title = updateDto.title
    }

    await chat.save()

    return chat
  }

  /**
   * 删除对话（软删除）
   */
  async remove(id: string, username: string) {
    const chat = await this.findOne(id, username)

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

    return chat
  }

  /**
   * 同步对话消息（覆盖式更新）
   */
  async syncMessages(id: string, username: string, messages: AddMessageDto[]) {
    const chat = await this.findOne(id, username)

    // 完全替换消息列表
    chat.messages = messages as any
    chat.lastMessageAt = new Date()

    await chat.save()

    return chat
  }
}

