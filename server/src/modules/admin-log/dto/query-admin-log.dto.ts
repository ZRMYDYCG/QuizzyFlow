import { IsOptional, IsString, IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryAdminLogDto {
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
  operatorId?: string

  @IsOptional()
  @IsString()
  module?: string

  @IsOptional()
  @IsString()
  action?: string

  @IsOptional()
  @IsString()
  resource?: string

  @IsOptional()
  @IsString()
  status?: 'success' | 'failed'

  @IsOptional()
  @IsString()
  startDate?: string

  @IsOptional()
  @IsString()
  endDate?: string

  @IsOptional()
  @IsString()
  keyword?: string
}

