import {
  IsString,
  IsBoolean,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ComponentItemDto } from './create-question.dto'

/**
 * 更新问卷 DTO
 * 所有字段都是可选的
 */
export class UpdateQuestionDto {
  @ApiPropertyOptional({
    description: '问卷标题',
    example: '客户满意度调查问卷',
  })
  @IsString()
  @IsOptional()
  title?: string

  @ApiPropertyOptional({
    description: '问卷描述',
    example: '感谢您参与我们的满意度调查',
  })
  @IsString()
  @IsOptional()
  desc?: string

  @ApiPropertyOptional({
    description: '自定义 JavaScript 代码',
    example: 'console.log("问卷加载完成");',
  })
  @IsString()
  @IsOptional()
  js?: string

  @ApiPropertyOptional({
    description: '自定义 CSS 样式',
    example: '.question-title { color: #333; }',
  })
  @IsString()
  @IsOptional()
  css?: string

  @ApiPropertyOptional({
    description: '是否已发布',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean

  @ApiPropertyOptional({
    description: '是否标星',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isStar?: boolean

  @ApiPropertyOptional({
    description: '是否已删除',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean

  @ApiPropertyOptional({
    description: '问卷组件列表',
    type: [ComponentItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentItemDto)
  @IsOptional()
  componentList?: ComponentItemDto[]

  @ApiPropertyOptional({
    description: '当前选中的组件ID',
    example: 'c_1234567890',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  selectedId?: string | null

  @ApiPropertyOptional({
    description: '复制的组件数据',
    example: null,
    nullable: true,
  })
  @IsOptional()
  copiedComponent?: Record<string, any> | null
}

