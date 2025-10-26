import { IsString, IsOptional } from 'class-validator'

export class UpdateChatDto {
  @IsString()
  @IsOptional()
  title?: string
}

