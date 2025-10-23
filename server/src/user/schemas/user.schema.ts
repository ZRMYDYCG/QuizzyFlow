import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

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
}

export const UserSchema = SchemaFactory.createForClass(User)

// 添加索引
UserSchema.index({ username: 1 }, { unique: true })
UserSchema.index({ createdAt: -1 })

