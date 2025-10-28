import { IsBoolean, IsOptional, IsNumber } from 'class-validator'

export class UpdateTemplateAdminDto {
  @IsBoolean()
  @IsOptional()
  isOfficial?: boolean

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean

  @IsNumber()
  @IsOptional()
  rating?: number
}

