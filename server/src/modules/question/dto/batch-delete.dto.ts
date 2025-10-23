import { IsArray, IsString, ArrayMinSize } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 批量删除 DTO
 */
export class BatchDeleteDto {
  @ApiProperty({
    description: '要删除的问卷ID列表',
    example: ['id1', 'id2', 'id3'],
    type: [String],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1, { message: '至少需要提供一个问卷ID' })
  @IsString({ each: true, message: '问卷ID必须是字符串' })
  ids: string[]
}

