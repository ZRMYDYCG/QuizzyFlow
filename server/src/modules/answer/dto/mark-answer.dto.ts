/**
 * 标记答卷 DTO
 */
import { IsBoolean, IsNotEmpty } from 'class-validator'

export class MarkAnswerDto {
  @IsBoolean()
  @IsNotEmpty()
  isValid: boolean // true: 正常, false: 异常
}

