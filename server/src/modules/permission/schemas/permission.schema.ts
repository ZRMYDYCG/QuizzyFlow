import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type PermissionDocument = HydratedDocument<Permission>

/**
 * 权限 Schema
 * 定义系统中所有可用的权限
 */
@Schema({
  timestamps: true,
  collection: 'permissions',
})
export class Permission {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    index: true,
  })
  code: string // 权限代码：user:view, question:create, admin:delete

  @Prop({
    required: true,
    trim: true,
  })
  name: string // 权限名称：查看用户、创建问卷、删除管理员

  @Prop({ default: '' })
  description: string // 权限描述

  @Prop({
    required: true,
    trim: true,
    index: true,
  })
  module: string // 所属模块：user, question, template, system, admin

  @Prop({
    required: true,
    trim: true,
  })
  action: string // 操作类型：view, create, update, delete, manage

  @Prop({ default: true })
  isActive: boolean // 是否启用

  @Prop({ default: false })
  isSystem: boolean // 是否为系统权限（不可删除）

  @Prop({
    type: [String],
    default: [],
  })
  dependencies: string[] // 依赖的权限（例如：delete 依赖 view）

  @Prop({ default: '' })
  createdBy: string
}

export const PermissionSchema = SchemaFactory.createForClass(Permission)

// 添加索引
PermissionSchema.index({ code: 1 }, { unique: true })
PermissionSchema.index({ module: 1, action: 1 })
PermissionSchema.index({ isSystem: 1, isActive: 1 })

