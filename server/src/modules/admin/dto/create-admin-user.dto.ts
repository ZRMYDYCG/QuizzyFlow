import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator'

export class CreateAdminUserDto {
  @IsEmail()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsString()
  @IsNotEmpty()
  nickname: string

  @IsString()
  @IsNotEmpty()
  role: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsString()
  @IsOptional()
  bio?: string
}

