import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator'
import { Type } from 'class-transformer'

/**
 * 查询反馈 DTO
 */
export class QueryFeedbackDto {
  @IsOptional()
  @IsString()
  @IsIn(['bug', 'feature', 'improvement', 'other', 'all'])
  type?: string

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'in_progress', 'resolved', 'closed', 'rejected', 'all'])
  status?: string

  @IsOptional()
  @IsString()
  @IsIn(['low', 'medium', 'high', 'critical', 'all'])
  priority?: string

  @IsOptional()
  @IsString()
  keyword?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number

  @IsOptional()
  @IsString()
  sortBy?: string // votes, createdAt
}

