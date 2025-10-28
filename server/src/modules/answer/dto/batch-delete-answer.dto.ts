/**
 * 批量删除答卷 DTO
 */
import { IsArray, IsString } from 'class-validator'

export class BatchDeleteAnswerDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[]
}

