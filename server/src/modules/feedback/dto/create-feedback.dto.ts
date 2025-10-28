import { IsString, IsNotEmpty, IsIn, IsOptional, IsArray } from 'class-validator'

/**
 * 创建反馈 DTO
 */
export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['bug', 'feature', 'improvement', 'other'])
  type: 'bug' | 'feature' | 'improvement' | 'other'

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsOptional()
  authorEmail?: string

  @IsString()
  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'critical'])
  priority?: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  screenshots?: string[]

  @IsString()
  @IsOptional()
  browserInfo?: string

  @IsString()
  @IsOptional()
  osInfo?: string
}

