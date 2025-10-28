import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type FeedbackDocument = HydratedDocument<Feedback>

/**
 * 反馈 Schema
 */
@Schema({
  timestamps: true,
  collection: 'feedbacks',
})
export class Feedback {
  @Prop({
    required: true,
    enum: ['bug', 'feature', 'improvement', 'other'],
    index: true,
  })
  type: string // 反馈类型

  @Prop({ required: true })
  title: string // 标题

  @Prop({ required: true })
  description: string // 详细描述

  @Prop({ required: true })
  author: string // 提交人用户名

  @Prop()
  authorEmail?: string // 邮箱

  @Prop({
    required: true,
    enum: ['pending', 'in_progress', 'resolved', 'closed', 'rejected'],
    default: 'pending',
    index: true,
  })
  status: string // 状态

  @Prop({
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    index: true,
  })
  priority: string // 优先级（Bug专用）

  @Prop()
  assignedTo?: string // 分配给谁（管理员用户名）

  @Prop({ default: 0 })
  votes: number // 投票数（功能请求专用）

  @Prop({ type: [String], default: [] })
  voters: string[] // 投票人列表

  @Prop({ type: [String], default: [] })
  tags: string[] // 标签

  @Prop({ type: [String], default: [] })
  screenshots: string[] // 截图URL

  @Prop()
  browserInfo?: string // 浏览器信息

  @Prop()
  osInfo?: string // 操作系统信息

  @Prop({
    type: [
      {
        content: { type: String, required: true },
        author: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  replies: Array<{
    content: string
    author: string
    createdAt: Date
  }> // 回复列表

  @Prop()
  resolvedAt?: Date // 解决时间

  @Prop()
  resolvedBy?: string // 解决人

  createdAt?: Date
  updatedAt?: Date
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback)

// 索引优化
FeedbackSchema.index({ type: 1, status: 1, createdAt: -1 })
FeedbackSchema.index({ author: 1, status: 1 })
FeedbackSchema.index({ votes: -1 }) // 按投票数排序

