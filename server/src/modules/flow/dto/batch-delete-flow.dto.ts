import { IsArray, IsString } from 'class-validator'

export class BatchDeleteDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[]
}

