import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'

export type AIChatDocument = HydratedDocument<AIChat>

/**
 * 操作提案（禁用 Mongoose 子文档 _id，使用 actionId 字符串）
 */
export interface ChatAction {
  actionId: string
  type: string
  data: Record<string, unknown>
  description?: string
  applied?: boolean
  appliedAt?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  reasoning?: string
  timestamp: number
  actions?: ChatAction[]
}

/** 嵌套子文档必须 _id: false，且不可用字段名 id（会映射到 _id） */
export const ChatActionSubSchema = new MongooseSchema(
  {
    actionId: { type: String, required: true },
    type: { type: String, required: true },
    data: { type: Object, required: true },
    description: String,
    applied: { type: Boolean, default: false },
    appliedAt: { type: Number, default: null },
  },
  { _id: false },
)

export const ChatMessageSubSchema = new MongooseSchema(
  {
    id: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: { type: String, required: true },
    reasoning: { type: String, default: '' },
    timestamp: { type: Number, required: true },
    actions: { type: [ChatActionSubSchema], default: [] },
  },
  { _id: false },
)

/**
 * AI 对话会话 Schema
 */
@Schema({
  timestamps: true,
  collection: 'ai_chats',
})
export class AIChat {
  @Prop({ required: true, index: true })
  questionId: string

  @Prop({ required: true, index: true })
  author: string

  @Prop({ required: true, trim: true })
  title: string

  @Prop({ type: [ChatMessageSubSchema], default: [] })
  messages: ChatMessage[]

  @Prop({ default: false })
  isDeleted: boolean

  @Prop({ type: Date, default: null })
  deletedAt: Date | null

  @Prop({ type: Date, default: () => new Date() })
  lastMessageAt: Date

  /** 最近一次打开/切换到此会话的时间（用于刷新后续聊） */
  @Prop({ type: Date, default: () => new Date() })
  lastOpenedAt: Date
}

export const AIChatSchema = SchemaFactory.createForClass(AIChat)

AIChatSchema.index({ questionId: 1, author: 1, isDeleted: 1 })
AIChatSchema.index({ author: 1, lastMessageAt: -1 })
AIChatSchema.index({ questionId: 1, lastMessageAt: -1 })
AIChatSchema.index({ questionId: 1, author: 1, lastOpenedAt: -1 })
