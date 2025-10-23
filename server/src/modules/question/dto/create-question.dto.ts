import {
  IsString,
  IsBoolean,
  IsArray,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * 组件项 DTO
 */
export class ComponentItemDto {
  @ApiProperty({
    description: '前端组件唯一标识',
    example: 'c_1234567890',
  })
  @IsString()
  @IsNotEmpty()
  fe_id: string

  @ApiProperty({
    description: '组件类型',
    example: 'QuestionInput',
  })
  @IsString()
  @IsNotEmpty()
  type: string

  @ApiProperty({
    description: '组件标题',
    example: '单行输入框',
  })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiPropertyOptional({
    description: '是否隐藏',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isHidden?: boolean

  @ApiPropertyOptional({
    description: '是否锁定',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isLocked?: boolean

  @ApiPropertyOptional({
    description: '组件属性配置',
    example: { placeholder: '请输入内容' },
  })
  @IsOptional()
  props?: Record<string, any>
}

/**
 * 创建问卷 DTO
 */
export class CreateQuestionDto {
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

