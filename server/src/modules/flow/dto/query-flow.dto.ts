import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryFlowDto {
  @IsOptional()
  @IsString()
  keyword?: string

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize?: number = 10

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isStar?: boolean

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isDeleted?: boolean = false
}

