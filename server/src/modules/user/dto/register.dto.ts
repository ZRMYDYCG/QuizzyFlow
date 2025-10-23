import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  Matches,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 注册 DTO
 */
export class RegisterDto {
  @ApiProperty({
    description: '用户邮箱',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  username: string

  @ApiProperty({
    description: '用户密码，至少6个字符，必须包含字母和数字',
    example: 'password123',
    minLength: 6,
    maxLength: 50,
    required: true,
  })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码至少6个字符' })
  @MaxLength(50, { message: '密码最多50个字符' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/, {
    message: '密码必须包含字母和数字',
  })
  password: string

  @ApiProperty({
    description: '用户昵称',
    example: '张三',
    minLength: 2,
    maxLength: 20,
    required: true,
  })
  @IsString({ message: '昵称必须是字符串' })
  @IsNotEmpty({ message: '昵称不能为空' })
  @MinLength(2, { message: '昵称至少2个字符' })
  @MaxLength(20, { message: '昵称最多20个字符' })
  nickname: string
}

