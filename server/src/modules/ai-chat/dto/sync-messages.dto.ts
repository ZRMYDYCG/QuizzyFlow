import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'
import { AddMessageDto } from './add-message.dto'

export class SyncMessagesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddMessageDto)
  messages: AddMessageDto[]
}
