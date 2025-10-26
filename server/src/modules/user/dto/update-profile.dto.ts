import { IsString, IsOptional, MaxLength, IsPhoneNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 更新个人信息 DTO
 */
export class UpdateProfileDto {
  @ApiProperty({
    description: '昵称',
    example: '张三',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: '昵称长度不能超过50个字符' })
  nickname?: string

  @ApiProperty({
    description: '头像 URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string

  @ApiProperty({
    description: '个人简介',
    example: '这是一段个人简介',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: '个人简介长度不能超过500个字符' })
  bio?: string

  @ApiProperty({
    description: '手机号',
    example: '13800138000',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string
}

