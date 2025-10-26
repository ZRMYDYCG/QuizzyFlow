import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import { User, UserDocument } from './schemas/user.schema'
import { RegisterDto } from './dto/register.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UpdatePreferencesDto } from './dto/update-preferences.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * 创建新用户（注册）
   */
  async create(registerDto: RegisterDto): Promise<UserResponseDto> {
    const { username, password, nickname } = registerDto

    // 检查用户名是否已存在
    const existingUser = await this.userModel
      .findOne({ username })
      .lean()
      .exec()

    if (existingUser) {
      throw new ConflictException('该邮箱已被注册')
    }

    // 密码加密
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // 创建用户
    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      nickname,
      isActive: true,
      lastLoginAt: null,
    })

    const savedUser = await newUser.save()

    return new UserResponseDto(savedUser.toObject())
  }

  /**
   * 通过用户名和密码查找用户（登录验证）
   */
  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ username }).exec()

    if (!user) {
      return null
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return null
    }

    // 检查账户是否激活
    if (!user.isActive) {
      throw new BadRequestException('账户已被禁用')
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date()
    await user.save()

    return user
  }

  /**
   * 通过用户名查找用户
   */
  async findByUsername(username: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ username }).exec()
  }

  /**
   * 通过 ID 查找用户
   */
  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id).lean().exec()

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    return new UserResponseDto(user)
  }

  /**
   * 更新用户信息
   */
  async update(id: string, updateData: Partial<User>): Promise<UserResponseDto> {
    // 不允许直接更新密码
    delete updateData.password

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .lean()
      .exec()

    if (!updatedUser) {
      throw new NotFoundException('用户不存在')
    }

    return new UserResponseDto(updatedUser)
  }

  /**
   * 修改密码
   */
  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userModel.findById(id).exec()

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    // 验证旧密码
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password)

    if (!isPasswordValid) {
      throw new BadRequestException('原密码错误')
    }

    // 加密新密码
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    user.password = hashedPassword
    await user.save()
  }

  /**
   * 更新个人信息
   */
  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: updateProfileDto },
        { new: true, runValidators: true },
      )
      .lean()
      .exec()

    if (!updatedUser) {
      throw new NotFoundException('用户不存在')
    }

    return new UserResponseDto(updatedUser)
  }

  /**
   * 更新用户偏好设置
   */
  async updatePreferences(
    id: string,
    updatePreferencesDto: UpdatePreferencesDto,
  ): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id).exec()

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    // 合并偏好设置
    if (updatePreferencesDto.editorSettings) {
      user.preferences = user.preferences || ({} as any)
      const currentSettings = user.preferences.editorSettings || {
        autoSave: true,
        autoSaveInterval: 30,
        defaultScale: 1,
        showGrid: true,
        showRulers: true,
      }
      user.preferences.editorSettings = {
        ...currentSettings,
        ...updatePreferencesDto.editorSettings,
      } as any
      delete updatePreferencesDto.editorSettings
    }

    // 更新其他偏好字段
    if (updatePreferencesDto.theme !== undefined) {
      user.preferences = user.preferences || ({} as any)
      user.preferences.theme = updatePreferencesDto.theme
    }
    if (updatePreferencesDto.language !== undefined) {
      user.preferences = user.preferences || ({} as any)
      user.preferences.language = updatePreferencesDto.language
    }
    if (updatePreferencesDto.listView !== undefined) {
      user.preferences = user.preferences || ({} as any)
      user.preferences.listView = updatePreferencesDto.listView
    }

    await user.save()

    return new UserResponseDto(user.toObject())
  }

  /**
   * 获取用户完整信息（包含偏好设置）
   */
  async getProfile(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id).lean().exec()

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    return new UserResponseDto(user)
  }
}
