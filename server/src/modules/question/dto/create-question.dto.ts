import {
  IsString,
  IsBoolean,
  IsArray,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator'
import { Type } from 'class-transformer'

/**
 * 组件项 DTO
 */
export class ComponentItemDto {
  @IsString()
  @IsNotEmpty()
  fe_id: string

  @IsString()
  @IsNotEmpty()
  type: string

  @IsString()
  @IsNotEmpty()
  title: string

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean

  @IsBoolean()
  @IsOptional()
  isLocked?: boolean

  @IsOptional()
  props?: Record<string, any>
}

/**
 * 创建问卷 DTO
 */
export class CreateQuestionDto {
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

