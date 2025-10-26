import { IsOptional, IsString, IsBoolean, IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryUsersDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number

  @IsOptional()
  @IsString()
  keyword?: string

  @IsOptional()
  @IsString()
  role?: string

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isBanned?: boolean

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'lastLoginAt' | 'username'

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc'
}

