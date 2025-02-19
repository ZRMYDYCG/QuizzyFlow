import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type QuestionDocument = HydratedDocument<Question>

@Schema({
  timestamps: true, // 记录时间戳
})
export class Question {
  @Prop({ required: true })
  title: string
  @Prop()
  desc: string
  @Prop()
  js: string
  @Prop()
  css: string
  @Prop({ default: false })
  isPublished: boolean
  @Prop({ default: false })
  isStar: boolean
  @Prop({ default: false })
  isDeleted: boolean
  @Prop({ required: true })
  author: string
  @Prop()
  componentList: {
    fe_id: string // 前端生成, 区分于_id
    type: string
    title: string
    isHidden: boolean
    isLocked: boolean
    props: object
  }[]
}
export const QuestionSchema = SchemaFactory.createForClass(Question)
