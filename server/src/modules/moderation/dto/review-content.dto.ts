import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator'

/**
 * 审核内容 DTO
 */
export class ReviewContentDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['approve', 'reject'])
  action: 'approve' | 'reject'

  @IsString()
  @IsOptional()
  reason?: string // 拒绝原因
}

