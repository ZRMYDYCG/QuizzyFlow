import { IsString, IsOptional, IsNumberString } from 'class-validator'

export class QueryChatDto {
  @IsString()
  @IsOptional()
  questionId?: string

  @IsNumberString()
  @IsOptional()
  page?: string

  @IsNumberString()
  @IsOptional()
  pageSize?: string
}

