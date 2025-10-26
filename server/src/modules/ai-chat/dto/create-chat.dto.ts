import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  questionId: string

  @IsString()
  @IsOptional()
  title?: string
}

