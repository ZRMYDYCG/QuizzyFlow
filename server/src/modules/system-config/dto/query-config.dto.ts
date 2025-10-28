import { IsString, IsOptional, IsBoolean } from 'class-validator'

export class QueryConfigDto {
  @IsString()
  @IsOptional()
  category?: string

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean

  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @IsString()
  @IsOptional()
  keyword?: string
}

