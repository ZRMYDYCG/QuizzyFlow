import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type QuestionDocument = HydratedDocument<Question>

/**
 * 组件接口 - 匹配前端设计
 */
export interface ComponentItem {
  fe_id: string // 前端生成的唯一ID
  type: string // 组件类型
  title: string // 组件标题
  isHidden?: boolean // 是否隐藏
  isLocked?: boolean // 是否锁定
  props: Record<string, any> // 组件属性
}

/**
 * 问卷 Schema
 * 完全匹配前端设计和 README.md 中的 JSON Schema
 */
@Schema({
  timestamps: true, // 自动添加 createdAt 和 updatedAt
  collection: 'questions',
})
export class Question {
  @Prop({ required: true, trim: true })
  title: string

  @Prop({ default: '', trim: true })
  desc: string

  @Prop({ default: '' })
  js: string

  @Prop({ default: '' })
  css: string

  @Prop({ default: false })
  isPublished: boolean

  @Prop({ default: false })
  isStar: boolean

  @Prop({ default: false })
  isDeleted: boolean

  @Prop({ type: Date, default: null })
  deletedAt: Date | null

  @Prop({ default: 0 })
  answerCount: number

  @Prop({ required: true, index: true })
  author: string

  @Prop({
    type: [
      {
        fe_id: { type: String, required: true },
        type: { type: String, required: true },
        title: { type: String, required: true },
        isHidden: { type: Boolean, default: false },
        isLocked: { type: Boolean, default: false },
        props: { type: Object, default: {} },
      },
    ],
    default: [],
  })
  componentList: ComponentItem[]

  @Prop({ type: String, default: null })
  selectedId: string | null

  @Prop({ type: Object, default: null })
  copiedComponent: Record<string, any> | null
}

export const QuestionSchema = SchemaFactory.createForClass(Question)

// 添加索引以优化查询性能
QuestionSchema.index({ author: 1, isDeleted: 1, isStar: 1 })
QuestionSchema.index({ author: 1, createdAt: -1 })
QuestionSchema.index({ title: 'text' }) // 文本搜索索引
