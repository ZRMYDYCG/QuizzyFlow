import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator'

/**
 * 创建敏感词 DTO
 */
export class CreateSensitiveWordDto {
  @IsString()
  @IsNotEmpty()
  word: string

  @IsString()
  @IsNotEmpty()
  @IsIn(['low', 'medium', 'high'])
  severity: 'low' | 'medium' | 'high'

  @IsString()
  @IsNotEmpty()
  @IsIn(['political', 'violence', 'pornography', 'fraud', 'spam', 'other'])
  category: string

  @IsString()
  @IsOptional()
  description?: string
}

