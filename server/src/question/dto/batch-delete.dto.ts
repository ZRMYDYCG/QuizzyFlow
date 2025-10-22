import { IsArray, IsString, ArrayMinSize } from 'class-validator'

/**
 * 批量删除 DTO
 */
export class BatchDeleteDto {
  @IsArray()
  @ArrayMinSize(1, { message: '至少需要提供一个问卷ID' })
  @IsString({ each: true, message: '问卷ID必须是字符串' })
  ids: string[]
}

