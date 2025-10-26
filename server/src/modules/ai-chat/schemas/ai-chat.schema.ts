import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type AIChatDocument = HydratedDocument<AIChat>

/**
 * AI 对话消息接口
 */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  actions?: Array<{
    type: string
    data: any
    description?: string
  }>
}

/**
 * AI 对话会话 Schema
 * 每个问卷可以有多个对话会话
 */
@Schema({
  timestamps: true,
  collection: 'ai_chats',
})
export class AIChat {
  @Prop({ required: true, index: true })
  questionId: string // 关联的问卷 ID

  @Prop({ required: true, index: true })
  author: string // 对话创建者（用户名）

  @Prop({ required: true, trim: true })
  title: string // 对话标题（自动生成或用户设置）

  @Prop({
    type: [
      {
        id: { type: String, required: true },
        role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Number, required: true },
        actions: {
          type: [
            {
              type: { type: String, required: true },
              data: { type: Object, required: true },
              description: String,
            },
          ],
          default: [],
        },
      },
    ],
    default: [],
  })
  messages: ChatMessage[]

  @Prop({ default: false })
  isDeleted: boolean // 软删除标记

  @Prop({ type: Date, default: null })
  deletedAt: Date | null

  @Prop({ type: Date, default: () => new Date() })
  lastMessageAt: Date // 最后一条消息的时间
}

export const AIChatSchema = SchemaFactory.createForClass(AIChat)

// 添加索引以优化查询性能
AIChatSchema.index({ questionId: 1, author: 1, isDeleted: 1 })
AIChatSchema.index({ author: 1, lastMessageAt: -1 })
AIChatSchema.index({ questionId: 1, lastMessageAt: -1 })

