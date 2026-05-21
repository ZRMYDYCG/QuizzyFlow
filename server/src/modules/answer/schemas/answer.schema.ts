import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose'

export type AnswerDocument = HydratedDocument<Answer>

/**
 * 答案项接口
 */
export interface AnswerItem {
  componentId: string // 组件ID (fe_id)
  componentType: string // 组件类型
  value: any // 答案值（可以是字符串、数组、对象等）
}

/**
 * 答卷 Schema
 */
@Schema({
  timestamps: true,
  collection: 'answers',
})
export class Answer {
  @Prop({ type: Types.ObjectId, ref: 'Question', required: true, index: true })
  questionId: Types.ObjectId

  @Prop({
    type: [
      {
        componentId: { type: String, required: true },
        componentType: { type: String, required: true },
        value: { type: MongooseSchema.Types.Mixed },
      },
    ],
    required: true,
  })
  answerList: AnswerItem[]

  @Prop()
  ip?: string

  @Prop()
  userAgent?: string

  @Prop()
  duration?: number // 答题用时（秒）

  /** 填写者展示名（匿名时为「匿名用户」） */
  @Prop()
  respondentName?: string

  /** 是否匿名提交 */
  @Prop({ default: false })
  isAnonymous?: boolean

  /** 已登录填写者的用户名（可选） */
  @Prop()
  respondentUsername?: string

  @Prop({ default: false })
  isValid: boolean // 是否有效（用于标记垃圾答卷）

  createdAt?: Date
  updatedAt?: Date
}

export const AnswerSchema = SchemaFactory.createForClass(Answer)

// 添加索引以优化查询性能
AnswerSchema.index({ questionId: 1, createdAt: -1 })

