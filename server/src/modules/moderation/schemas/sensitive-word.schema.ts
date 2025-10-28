import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type SensitiveWordDocument = HydratedDocument<SensitiveWord>

/**
 * 敏感词 Schema
 */
@Schema({
  timestamps: true,
  collection: 'sensitive_words',
})
export class SensitiveWord {
  @Prop({ required: true, unique: true, index: true })
  word: string // 敏感词

  @Prop({
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  severity: string // 严重程度

  @Prop({
    required: true,
    enum: ['political', 'violence', 'pornography', 'fraud', 'spam', 'other'],
    default: 'other',
  })
  category: string // 分类

  @Prop({ default: true })
  isActive: boolean // 是否启用

  @Prop()
  description?: string // 说明

  @Prop()
  addedBy?: string // 添加人

  createdAt?: Date
  updatedAt?: Date
}

export const SensitiveWordSchema = SchemaFactory.createForClass(SensitiveWord)

// 索引
SensitiveWordSchema.index({ word: 'text' })
SensitiveWordSchema.index({ isActive: 1, severity: -1 })

