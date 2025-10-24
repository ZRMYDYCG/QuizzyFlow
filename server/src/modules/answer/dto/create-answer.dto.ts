import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
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

  // value 可以是任意类型，根据组件类型不同而不同
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
}

