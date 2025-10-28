import { IsArray, IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator'

/**
 * 批量审核 DTO
 */
export class BatchReviewDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[] // 审核记录IDs

  @IsString()
  @IsNotEmpty()
  @IsIn(['approve', 'reject'])
  action: 'approve' | 'reject'

  @IsString()
  @IsOptional()
  reason?: string // 拒绝原因（批量拒绝时）
}

