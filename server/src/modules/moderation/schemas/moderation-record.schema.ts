import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type ModerationRecordDocument = HydratedDocument<ModerationRecord>

/**
 * 审核记录 Schema
 */
@Schema({
  timestamps: true,
  collection: 'moderation_records',
})
export class ModerationRecord {
  @Prop({ required: true, enum: ['question', 'template', 'comment'] })
  contentType: string // 内容类型

  @Prop({ type: Types.ObjectId, required: true })
  contentId: Types.ObjectId // 内容ID

  @Prop({ required: true })
  contentTitle: string // 内容标题

  @Prop({ required: true })
  author: string // 作者用户名

  @Prop({
    required: true,
    enum: ['pending', 'approved', 'rejected', 'auto_approved'],
    default: 'pending',
    index: true,
  })
  status: string // 审核状态

  @Prop({
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'low',
    index: true,
  })
  riskLevel: string // 风险等级

  @Prop({ type: [String], default: [] })
  detectedKeywords: string[] // 检测到的敏感词

  @Prop({ type: Number, default: 0 })
  riskScore: number // 风险评分 (0-100)

  @Prop({ default: false })
  isAutoReviewed: boolean // 是否自动审核

  @Prop()
  reviewedBy?: string // 审核人

  @Prop()
  reviewedAt?: Date // 审核时间

  @Prop()
  rejectionReason?: string // 拒绝原因

  @Prop({ type: Object })
  metadata?: Record<string, any> // 附加元数据

  createdAt?: Date
  updatedAt?: Date
}

export const ModerationRecordSchema = SchemaFactory.createForClass(ModerationRecord)

// 索引优化
ModerationRecordSchema.index({ status: 1, riskLevel: -1, createdAt: -1 })
ModerationRecordSchema.index({ author: 1, status: 1 })
ModerationRecordSchema.index({ contentType: 1, contentId: 1 })

