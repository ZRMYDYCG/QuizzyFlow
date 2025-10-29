import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type FlowDocument = HydratedDocument<Flow>

/**
 * React Flow 节点接口
 */
export interface FlowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: Record<string, any>
  width?: number
  height?: number
}

/**
 * React Flow 边接口
 */
export interface FlowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  type?: string
  animated?: boolean
  label?: string
  data?: Record<string, any>
}

/**
 * 视口配置
 */
export interface FlowViewport {
  x: number
  y: number
  zoom: number
}

/**
 * Flow 工作流 Schema
 */
@Schema({
  timestamps: true,
  collection: 'flows',
})
export class Flow {
  @Prop({ required: true, trim: true })
  title: string

  @Prop({ default: '', trim: true })
  description: string

  @Prop({ default: false })
  isStar: boolean

  @Prop({ default: false })
  isDeleted: boolean

  @Prop({ type: Date, default: null })
  deletedAt: Date | null

  @Prop({ required: true, index: true })
  author: string

  // Flow 数据
  @Prop({
    type: [
      {
        id: { type: String, required: true },
        type: { type: String, required: true },
        position: {
          x: { type: Number, required: true },
          y: { type: Number, required: true },
        },
        data: { type: Object, default: {} },
        width: { type: Number },
        height: { type: Number },
      },
    ],
    default: [],
  })
  nodes: FlowNode[]

  @Prop({
    type: [
      {
        id: { type: String, required: true },
        source: { type: String, required: true },
        target: { type: String, required: true },
        sourceHandle: { type: String },
        targetHandle: { type: String },
        type: { type: String },
        animated: { type: Boolean, default: false },
        label: { type: String },
        data: { type: Object, default: {} },
      },
    ],
    default: [],
  })
  edges: FlowEdge[]

  // 视口配置
  @Prop({
    type: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      zoom: { type: Number, default: 1 },
    },
    default: { x: 0, y: 0, zoom: 1 },
  })
  viewport: FlowViewport

  // 缩略图（base64 或 URL）
  @Prop({ default: null })
  thumbnail: string | null

  // 统计信息
  @Prop({ default: 0 })
  nodeCount: number

  @Prop({ default: 0 })
  edgeCount: number

  // 版本控制（预留）
  @Prop({ default: 1 })
  version: number

  // 关联的问卷 ID（可选）
  @Prop({ type: String, default: null })
  linkedQuestionId: string | null
}

export const FlowSchema = SchemaFactory.createForClass(Flow)

// 索引优化
FlowSchema.index({ author: 1, isDeleted: 1, isStar: 1 })
FlowSchema.index({ author: 1, createdAt: -1 })
FlowSchema.index({ title: 'text', description: 'text' })

