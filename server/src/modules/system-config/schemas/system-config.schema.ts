import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type SystemConfigDocument = HydratedDocument<SystemConfig>

/**
 * 系统配置 Schema
 * 存储系统级别的配置信息
 */
@Schema({
  timestamps: true,
  collection: 'system_configs',
})
export class SystemConfig {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    index: true,
  })
  key: string // 配置键：site.name, register.enabled, upload.maxSize

  @Prop({
    required: true,
    type: Object,
  })
  value: any // 配置值（支持任意类型）

  @Prop({ default: 'string' })
  valueType: string // 值类型：string, number, boolean, object, array

  @Prop({
    required: true,
    trim: true,
  })
  name: string // 配置名称

  @Prop({ default: '' })
  description: string // 配置描述

  @Prop({
    required: true,
    index: true,
  })
  category: string // 配置分类：site, security, upload, email, ai, payment

  @Prop({ default: false })
  isPublic: boolean // 是否对前端公开（公开的配置可以通过API获取）

  @Prop({ default: false })
  isEncrypted: boolean // 是否加密存储（如API密钥）

  @Prop({ default: true })
  isActive: boolean // 是否启用

  @Prop({ default: false })
  isSystem: boolean // 是否为系统配置（不可删除）

  @Prop({ type: Object, default: null })
  validation: {
    min?: number
    max?: number
    pattern?: string
    options?: string[] // 枚举值
  } // 验证规则

  @Prop({ default: 0 })
  sortOrder: number // 排序顺序

  @Prop({ default: '' })
  updatedBy: string // 最后更新者
}

export const SystemConfigSchema = SchemaFactory.createForClass(SystemConfig)

// 添加索引
SystemConfigSchema.index({ key: 1 }, { unique: true })
SystemConfigSchema.index({ category: 1, sortOrder: 1 })
SystemConfigSchema.index({ isPublic: 1, isActive: 1 })

