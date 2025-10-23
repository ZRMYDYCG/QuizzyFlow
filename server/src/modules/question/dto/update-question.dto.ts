import {
  IsString,
  IsBoolean,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ComponentItemDto } from './create-question.dto'

/**
 * 更新问卷 DTO
 * 所有字段都是可选的
 */
export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  desc?: string

  @IsString()
  @IsOptional()
  js?: string

  @IsString()
  @IsOptional()
  css?: string

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean

  @IsBoolean()
  @IsOptional()
  isStar?: boolean

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentItemDto)
  @IsOptional()
  componentList?: ComponentItemDto[]

  @IsString()
  @IsOptional()
  selectedId?: string | null

  @IsOptional()
  copiedComponent?: Record<string, any> | null
}

