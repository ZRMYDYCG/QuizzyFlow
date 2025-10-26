import { IsOptional, IsString, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryRoleDto {
  @IsOptional()
  @IsString()
  keyword?: string

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isSystem?: boolean

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean
}

