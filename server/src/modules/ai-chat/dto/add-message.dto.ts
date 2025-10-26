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
    type: string
    data: any
    description?: string
  }>
}

