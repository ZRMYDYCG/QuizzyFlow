/**
 * 管理员查询答卷 DTO
 */
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryAnswerAdminDto {
  @IsOptional()
  @IsString()
  questionId?: string // 问卷ID筛选

  @IsOptional()
  @IsString()
  keyword?: string // 搜索关键词（搜索IP、User-Agent等）

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number

  @IsOptional()
  @IsString()
  startDate?: string // 开始日期

  @IsOptional()
  @IsString()
  endDate?: string // 结束日期

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isValid?: boolean // 是否有效（true: 正常, false: 异常）

  @IsOptional()
  @IsString()
  sortBy?: string // 排序字段: createdAt, duration
}

