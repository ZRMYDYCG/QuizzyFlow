import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type AdminLogDocument = HydratedDocument<AdminLog>

/**
 * 操作日志 Schema
 * 记录管理员的所有操作
 */
@Schema({
  timestamps: true,
  collection: 'admin_logs',
})
export class AdminLog {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
    index: true,
  })
  operatorId: Types.ObjectId // 操作人ID

  @Prop({ required: true })
  operatorName: string // 操作人名称

  @Prop({ required: true })
  operatorRole: string // 操作人角色

  @Prop({
    required: true,
    index: true,
  })
  module: string // 模块：user, question, template, system, role, permission

  @Prop({
    required: true,
    index: true,
  })
  action: string // 操作：create, update, delete, view, export, login, logout

  @Prop({
    required: true,
    index: true,
  })
  resource: string // 资源类型：user, question, role, permission, config

  @Prop({ default: '' })
  resourceId: string // 资源ID

  @Prop({ default: '' })
  resourceName: string // 资源名称

  @Prop({ type: Object, default: {} })
  details: Record<string, any> // 操作详情（JSON）

  @Prop({ type: Object, default: {} })
  changes: {
    before?: any // 修改前的数据
    after?: any // 修改后的数据
  }

  @Prop({
    required: true,
    index: true,
  })
  status: string // 操作状态：success, failed

  @Prop({ default: '' })
  errorMessage: string // 错误信息（如果失败）

  @Prop({ required: true })
  ip: string // IP地址

  @Prop({ default: '' })
  userAgent: string // User-Agent

  @Prop({ default: '' })
  location: string // 地理位置（可选）

  @Prop({ type: Date, default: Date.now, index: true })
  operatedAt: Date // 操作时间
}

export const AdminLogSchema = SchemaFactory.createForClass(AdminLog)

// 添加复合索引
AdminLogSchema.index({ operatorId: 1, operatedAt: -1 })
AdminLogSchema.index({ module: 1, action: 1, operatedAt: -1 })
AdminLogSchema.index({ resource: 1, resourceId: 1 })
AdminLogSchema.index({ status: 1, operatedAt: -1 })

// TTL 索引：日志保留 180 天
AdminLogSchema.index({ operatedAt: 1 }, { expireAfterSeconds: 180 * 24 * 60 * 60 })

