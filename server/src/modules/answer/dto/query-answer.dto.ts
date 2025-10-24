import { IsOptional, IsString, IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'

/**
 * 查询答卷 DTO
 */
export class QueryAnswerDto {
  @IsOptional()
  @IsString()
  questionId?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number = 10
}

