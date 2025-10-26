import { ApiProperty } from '@nestjs/swagger'

/**
 * 用户响应 DTO（不包含密码）
 */
export class UserResponseDto {
  @ApiProperty({ description: '用户ID' })
  _id: string

  @ApiProperty({ description: '用户邮箱', example: 'user@example.com' })
  username: string

  @ApiProperty({ description: '用户昵称', example: '张三' })
  nickname: string

  @ApiProperty({ description: '账号是否激活', example: true })
  isActive: boolean

  @ApiProperty({ description: '最后登录时间', example: '2024-01-01T00:00:00Z', nullable: true })
  lastLoginAt: Date | null

  @ApiProperty({ description: '创建时间', example: '2024-01-01T00:00:00Z' })
  createdAt: Date

  @ApiProperty({ description: '更新时间', example: '2024-01-01T00:00:00Z' })
  updatedAt: Date

  @ApiProperty({ description: '头像 URL', example: '', required: false })
  avatar?: string

  @ApiProperty({ description: '个人简介', example: '', required: false })
  bio?: string

  @ApiProperty({ description: '手机号', example: '', required: false })
  phone?: string

  @ApiProperty({ description: '用户偏好设置', required: false })
  preferences?: any

  constructor(user: any) {
    this._id = user._id
    this.username = user.username
    this.nickname = user.nickname
    this.isActive = user.isActive
    this.lastLoginAt = user.lastLoginAt
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
    this.avatar = user.avatar || ''
    this.bio = user.bio || ''
    this.phone = user.phone || ''
    this.preferences = user.preferences || {}
  }
}

