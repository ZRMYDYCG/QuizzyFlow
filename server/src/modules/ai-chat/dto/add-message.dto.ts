import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsArray } from 'class-validator'

export class AddMessageDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsEnum(['user', 'assistant', 'system'])
  role: 'user' | 'assistant' | 'system'

  @IsString()
  @IsNotEmpty()
  content: string

  @IsNumber()
  timestamp: number

  @IsArray()
  @IsOptional()
  actions?: Array<{
    /** 前端字段，入库时转为 actionId */
    id?: string
    actionId?: string
    type: string
    data: Record<string, unknown>
    description?: string
    applied?: boolean
    appliedAt?: number
  }>
}

