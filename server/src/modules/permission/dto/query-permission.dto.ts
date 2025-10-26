import { IsOptional, IsString, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryPermissionDto {
  @IsOptional()
  @IsString()
  keyword?: string

  @IsOptional()
  @IsString()
  module?: string

  @IsOptional()
  @IsString()
  action?: string

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isSystem?: boolean

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean
}

