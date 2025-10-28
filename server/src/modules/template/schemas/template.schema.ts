import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type TemplateDocument = HydratedDocument<Template>

/**
 * 模板数据接口
 */
export interface TemplateData {
  title: string
  desc: string
  type: string
  componentList: any[]
  pageInfo: Record<string, any>
}

/**
 * 模板 Schema
 */
@Schema({
  timestamps: true,
  collection: 'templates',
})
export class Template {
  @Prop({ required: true, trim: true })
  name: string

  @Prop({ required: true, trim: true })
  description: string

  @Prop({ default: '' })
  thumbnail: string

  @Prop({ required: true, index: true })
  category: string // business, education, research, hr, event, feedback, medical, custom

  @Prop({ required: true, index: true })
  type: string // 问卷类型: survey, exam, vote, form 等

  @Prop({ type: [String], default: [] })
  tags: string[]

  @Prop({ type: Object, required: true })
  templateData: TemplateData

  @Prop({ required: true, index: true })
  author: string

  @Prop({ required: true })
  authorNickname: string

  @Prop({ default: '' })
  authorAvatar: string

  @Prop({ default: false })
  isOfficial: boolean

  @Prop({ default: true })
  isPublic: boolean

  @Prop({ default: false })
  isFeatured: boolean

  @Prop({ default: 0 })
  useCount: number

  @Prop({ default: 0 })
  likeCount: number

  @Prop({ default: 0 })
  viewCount: number

  @Prop({ default: 5 })
  rating: number

  // 审核相关字段
  @Prop({ 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'approved',
    index: true 
  })
  approvalStatus: string

  @Prop({ default: '' })
  rejectionReason: string

  @Prop({ type: Date })
  approvedAt?: Date

  @Prop()
  approvedBy?: string
}

export const TemplateSchema = SchemaFactory.createForClass(Template)

// 添加索引以优化查询性能
TemplateSchema.index({ author: 1, isPublic: 1 })
TemplateSchema.index({ category: 1, type: 1 })
TemplateSchema.index({ isFeatured: 1, isOfficial: 1 })
TemplateSchema.index({ useCount: -1 })
TemplateSchema.index({ likeCount: -1 })
TemplateSchema.index({ createdAt: -1 })
TemplateSchema.index({ name: 'text', description: 'text' }) // 文本搜索索引

