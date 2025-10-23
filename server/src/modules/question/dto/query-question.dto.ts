import { IsString, IsBoolean, IsNumber, IsOptional, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

/**
 * 查询问卷列表 DTO
 */
export class QueryQuestionDto {
  @ApiPropertyOptional({
    description: '搜索关键词，用于搜索问卷标题',
    example: '满意度调查',
  })
  @IsString()
  @IsOptional()
  keyword?: string

  @ApiPropertyOptional({
    description: '是否只查询标星问卷',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isStar?: boolean

  @ApiPropertyOptional({
    description: '是否只查询已删除问卷',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isDeleted?: boolean

  @ApiPropertyOptional({
    description: '页码',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({
    description: '每页数量',
    example: 10,
    minimum: 1,
    default: 10,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  pageSize?: number = 10
}

