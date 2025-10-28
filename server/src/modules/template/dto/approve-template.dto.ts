import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator'

export class ApproveTemplateDto {
  @IsEnum(['approve', 'reject'])
  @IsNotEmpty()
  action: 'approve' | 'reject'

  @IsString()
  @IsOptional()
  reason?: string
}

