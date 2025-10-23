import { IsEmail, IsString, IsNotEmpty } from 'class-validator'

/**
 * 登录 DTO
 */
export class LoginDto {
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  username: string

  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string
}

