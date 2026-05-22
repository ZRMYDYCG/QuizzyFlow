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

  /** 关联的 Mongo 会话 ID（可选，用于日志与后续扩展） */
  @IsOptional()
  @IsString()
  chatId?: string
}
