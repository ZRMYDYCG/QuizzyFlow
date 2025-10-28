import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator'
import { Type } from 'class-transformer'

/**
 * 查询审核记录 DTO
 */
export class QueryModerationDto {
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'approved', 'rejected', 'auto_approved', 'all'])
  status?: string

  @IsOptional()
  @IsString()
  @IsIn(['question', 'template', 'comment', 'all'])
  contentType?: string

  @IsOptional()
  @IsString()
  @IsIn(['low', 'medium', 'high', 'all'])
  riskLevel?: string

  @IsOptional()
  @IsString()
  keyword?: string // 搜索关键词

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number
}

