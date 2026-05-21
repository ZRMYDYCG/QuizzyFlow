import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

/**
 * 编辑器设置
 */
export class EditorSettings {
  @Prop({ default: true })
  autoSave: boolean // 自动保存

  @Prop({ default: 30 })
  autoSaveInterval: number // 自动保存间隔（秒）

  @Prop({ default: 1 })
  defaultScale: number // 默认缩放比例

  @Prop({ default: true })
  showGrid: boolean // 显示网格

  @Prop({ default: true })
  showRulers: boolean // 显示标尺
}

/**
 * 用户偏好设置
 */
export class UserPreferences {
  @Prop({ default: 'light' })
  theme: string // 主题：light / dark

  @Prop({ default: 'zh-CN' })
  language: string // 语言：zh-CN / en-US

  @Prop({ type: EditorSettings, default: {} })
  editorSettings: EditorSettings // 编辑器设置

  @Prop({ default: 'card' })
  listView: string // 列表展示方式：card / table
}

/**
 * 用户 Schema
 */
@Schema({
  timestamps: true, // 自动添加 createdAt 和 updatedAt
  collection: 'users',
})
export class User {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  username: string // 邮箱作为用户名

  @Prop({ required: true })
  password: string // 加密后的密码

  @Prop({ required: true, trim: true })
  nickname: string // 昵称

  @Prop({ default: true })
  isActive: boolean // 账户是否激活

  @Prop({ type: Date, default: null })
  lastLoginAt: Date // 最后登录时间

  // 基本信息字段
  @Prop({ default: '' })
  avatar: string // 头像 URL

  @Prop({ default: '' })
  bio: string // 个人简介

  @Prop({ default: '' })
  phone: string // 手机号

  @Prop({ type: UserPreferences, default: {} })
  preferences: UserPreferences // 用户偏好设置

  // 🆕 角色权限字段
  @Prop({
    default: 'user',
    index: true,
  })
  role: string // 角色标识：user, admin, super_admin, custom_role_name

  @Prop({
    type: [String],
    default: [],
  })
  customPermissions: string[] // 已授权按钮权限（与 grantedButtons 同步，供 API 守卫使用）

  @Prop({
    type: [String],
    default: [],
  })
  grantedRoutes: string[] // 已授权管理后台路由，如 /admin/users

  @Prop({
    type: [String],
    default: [],
  })
  grantedButtons: string[] // 已授权按钮权限码，如 user:create

  @Prop({ default: false })
  isBanned: boolean // 是否被封禁

  @Prop({ type: Date, default: null })
  bannedAt: Date // 封禁时间

  @Prop({ default: '' })
  bannedReason: string // 封禁原因

  @Prop({ default: '' })
  bannedBy: string // 封禁操作人
}

export const UserSchema = SchemaFactory.createForClass(User)

// 添加索引
UserSchema.index({ username: 1 }, { unique: true })
UserSchema.index({ createdAt: -1 })
UserSchema.index({ role: 1, isActive: 1 })
UserSchema.index({ isBanned: 1 })

