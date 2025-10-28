import { IsString, IsNotEmpty } from 'class-validator'

/**
 * 回复反馈 DTO
 */
export class ReplyFeedbackDto {
  @IsString()
  @IsNotEmpty()
  content: string
}

