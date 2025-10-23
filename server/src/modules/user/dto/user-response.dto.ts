/**
 * 用户响应 DTO（不包含密码）
 */
export class UserResponseDto {
  _id: string
  username: string
  nickname: string
  isActive: boolean
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date

  constructor(user: any) {
    this._id = user._id
    this.username = user.username
    this.nickname = user.nickname
    this.isActive = user.isActive
    this.lastLoginAt = user.lastLoginAt
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
  }
}

