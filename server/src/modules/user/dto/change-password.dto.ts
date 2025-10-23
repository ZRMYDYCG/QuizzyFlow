import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  Matches,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 修改密码 DTO
 */
export class ChangePasswordDto {
  @ApiProperty({
    description: '旧密码',
    example: 'oldPassword123',
    required: true,
  })
  @IsString({ message: '旧密码必须是字符串' })
  @IsNotEmpty({ message: '旧密码不能为空' })
  oldPassword: string

  @ApiProperty({
    description: '新密码，至少6个字符，必须包含字母和数字',
    example: 'newPassword123',
    minLength: 6,
    maxLength: 50,
    required: true,
  })
  @IsString({ message: '新密码必须是字符串' })
  @IsNotEmpty({ message: '新密码不能为空' })
  @MinLength(6, { message: '新密码至少6个字符' })
  @MaxLength(50, { message: '新密码最多50个字符' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/, {
    message: '新密码必须包含字母和数字',
  })
  newPassword: string
}

