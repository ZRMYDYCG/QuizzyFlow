import { IsArray, IsObject, IsOptional, IsString } from 'class-validator'

export class AgentChatContextDto {
  @IsOptional()
  questionId?: string

  @IsOptional()
  questionTitle?: string

  @IsOptional()
  questionDesc?: string

  @IsOptional()
  selectedComponentId?: string

  @IsOptional()
  @IsArray()
  currentComponents?: Array<{
    fe_id: string
    type: string
    title: string
    props?: Record<string, unknown>
  }>
}

export class AttachedComponentDto {
  fe_id: string
  type: string
  title: string
  props?: Record<string, unknown>
}

export class AgentChatDto {
  @IsOptional()
  @IsArray()
  messages?: unknown[]

  @IsOptional()
  @IsArray()
  uiMessages?: unknown[]

  @IsOptional()
  @IsObject()
  context?: AgentChatContextDto

  /** 当前请求附带的问卷组件引用（token 优化后的精简 JSON） */
  @IsOptional()
  @IsArray()
  attachedComponents?: AttachedComponentDto[]

  /** 历史用户消息 id -> 引用组件，用于多轮对话 */
  @IsOptional()
  @IsObject()
  messageAttachments?: Record<string, AttachedComponentDto[]>

  /** 关联的 Mongo 会话 ID（可选，用于日志与后续扩展） */
  @IsOptional()
  @IsString()
  chatId?: string
}
