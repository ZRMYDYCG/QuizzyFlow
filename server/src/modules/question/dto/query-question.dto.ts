import { IsString, IsBoolean, IsNumber, IsOptional, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { QueryBoolean } from '../../../common/transforms/query-boolean.transform'

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
  @QueryBoolean()
  isStar?: boolean

  @ApiPropertyOptional({
    description: '是否只查询已删除问卷',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  @QueryBoolean()
  isDeleted?: boolean

  @ApiPropertyOptional({
    description: '问卷类型筛选，如 survey、exam、vote 等',
    example: 'survey',
  })
  @IsString()
  @IsOptional()
  type?: string

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

