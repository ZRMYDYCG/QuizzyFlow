import { IsString, IsOptional, IsIn } from 'class-validator'

/**
 * 更新反馈 DTO
 */
export class UpdateFeedbackDto {
  @IsString()
  @IsOptional()
  @IsIn(['pending', 'in_progress', 'resolved', 'closed', 'rejected'])
  status?: string

  @IsString()
  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'critical'])
  priority?: string

  @IsString()
  @IsOptional()
  assignedTo?: string
}

