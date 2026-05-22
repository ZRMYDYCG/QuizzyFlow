import { IsArray, IsObject, IsOptional } from 'class-validator'

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
}
