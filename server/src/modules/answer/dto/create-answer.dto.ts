import {
  Allow,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

/**
 * 答案项 DTO
 */
export class AnswerItemDto {
  @IsString()
  @IsNotEmpty()
  componentId: string

  @IsString()
  @IsNotEmpty()
  componentType: string

  /** 答案值（字符串 / 数组 / 对象等）；须 @Allow() 否则 whitelist 会剥离该字段 */
  @Allow()
  value: any
}

/**
 * 创建答卷 DTO
 */
export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerItemDto)
  answerList: AnswerItemDto[]

  @IsNumber()
  @IsOptional()
  duration?: number

  @IsString()
  @IsOptional()
  @MaxLength(50)
  respondentName?: string

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean

  @IsString()
  @IsOptional()
  respondentUsername?: string
}

