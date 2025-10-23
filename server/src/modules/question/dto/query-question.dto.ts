import { IsString, IsBoolean, IsNumber, IsOptional, Min } from 'class-validator'
import { Type } from 'class-transformer'

/**
 * 查询问卷列表 DTO
 */
export class QueryQuestionDto {
  @IsString()
  @IsOptional()
  keyword?: string

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isStar?: boolean

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isDeleted?: boolean

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  pageSize?: number = 10
}

