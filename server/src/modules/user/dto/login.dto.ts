import { IsEmail, IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 登录 DTO
 */
export class LoginDto {
  @ApiProperty({
    description: '用户邮箱',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  username: string

  @ApiProperty({
    description: '用户密码',
    example: 'password123',
    required: true,
  })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string
}

