import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type RoleDocument = HydratedDocument<Role>

/**
 * 角色 Schema
 * 支持自定义角色和权限分配
 */
@Schema({
  timestamps: true,
  collection: 'roles',
})
export class Role {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    index: true,
  })
  name: string // 角色名称（英文标识）：user, admin, super_admin, custom_role_1

  @Prop({
    required: true,
    trim: true,
  })
  displayName: string // 角色显示名称（中文）：普通用户、管理员、超级管理员

  @Prop({ default: '' })
  description: string // 角色描述

  @Prop({
    type: [String],
    default: [],
    index: true,
  })
  permissions: string[] // 权限列表：['user:view', 'question:create', ...]

  @Prop({ default: false })
  isSystem: boolean // 是否为系统内置角色（不可删除）

  @Prop({ default: true })
  isActive: boolean // 是否启用

  @Prop({ default: 0 })
  priority: number // 优先级，数字越大权限越高

  @Prop({ default: 0 })
  userCount: number // 使用该角色的用户数量（冗余字段，方便查询）

  @Prop({ type: Date, default: null })
  deletedAt: Date // 软删除时间

  @Prop({ default: '' })
  createdBy: string // 创建者

  @Prop({ default: '' })
  updatedBy: string // 更新者
}

export const RoleSchema = SchemaFactory.createForClass(Role)

// 添加索引
RoleSchema.index({ name: 1 }, { unique: true })
RoleSchema.index({ isSystem: 1, isActive: 1 })
RoleSchema.index({ priority: -1 })

