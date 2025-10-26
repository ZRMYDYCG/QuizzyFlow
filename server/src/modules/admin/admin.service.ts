import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import { User, UserDocument } from '../user/schemas/user.schema'
import { Question, QuestionDocument } from '../question/schemas/question.schema'
import { Answer, AnswerDocument } from '../answer/schemas/answer.schema'
import { QueryUsersDto } from './dto/query-users.dto'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'
import { BanUserDto } from './dto/ban-user.dto'
import { CreateAdminUserDto } from './dto/create-admin-user.dto'
import { RoleService } from '../role/role.service'

/**
 * 管理员服务
 * 负责用户管理、系统统计等管理功能
 */
@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(Answer.name) private answerModel: Model<AnswerDocument>,
    private roleService: RoleService,
  ) {}

  /**
   * 获取用户列表（分页）
   */
  async getUsers(queryDto: QueryUsersDto) {
    const {
      page = 1,
      pageSize = 20,
      keyword,
      role,
      isActive,
      isBanned,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryDto

    // 构建查询条件
    const filter: any = {}

    if (keyword) {
      filter.$or = [
        { username: { $regex: keyword, $options: 'i' } },
        { nickname: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } },
      ]
    }

    if (role) {
      filter.role = role
    }

    if (isActive !== undefined) {
      filter.isActive = isActive
    }

    if (isBanned !== undefined) {
      filter.isBanned = isBanned
    }

    // 排序
    const sortOptions: any = {}
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1

    // 分页查询
    const skip = (page - 1) * pageSize
    const [list, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('-password') // 不返回密码
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),
      this.userModel.countDocuments(filter),
    ])

    return {
      list,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    }
  }

  /**
   * 获取用户详情
   */
  async getUserDetail(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .lean()
      .exec()

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    // 获取用户的问卷和答卷统计
    const [questionCount, answerCount] = await Promise.all([
      this.questionModel.countDocuments({ author: user.username }),
      this.answerModel.countDocuments({ username: user.username }),
    ])

    return {
      ...user,
      statistics: {
        questionCount,
        answerCount,
      },
    }
  }

  /**
   * 创建管理员用户
   */
  async createAdminUser(
    createDto: CreateAdminUserDto,
    createdBy: string,
  ): Promise<any> {
    // 检查用户名是否已存在
    const existing = await this.userModel.findOne({
      username: createDto.username,
    })
    if (existing) {
      throw new ConflictException('该邮箱已被注册')
    }

    // 验证角色是否存在
    const role = await this.roleService.findByName(createDto.role)
    if (!role) {
      throw new BadRequestException('角色不存在')
    }

    // 密码加密
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(createDto.password, saltRounds)

    // 创建用户
    const user = new this.userModel({
      username: createDto.username,
      password: hashedPassword,
      nickname: createDto.nickname,
      role: createDto.role,
      phone: createDto.phone || '',
      bio: createDto.bio || '',
      isActive: true,
      isBanned: false,
    })

    const savedUser = await user.save()

    // 更新角色的用户计数
    await this.roleService.updateUserCount(createDto.role)

    // 返回时不包含密码
    const { password, ...userWithoutPassword } = savedUser.toObject()
    return userWithoutPassword
  }

  /**
   * 更新用户角色
   */
  async updateUserRole(
    userId: string,
    updateDto: UpdateUserRoleDto,
    updatedBy: string,
  ): Promise<any> {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    // 验证角色是否存在
    const role = await this.roleService.findByName(updateDto.role)
    if (!role) {
      throw new BadRequestException('角色不存在')
    }

    // 防止降级最后一个超级管理员
    if (user.role === 'super_admin' && updateDto.role !== 'super_admin') {
      const superAdminCount = await this.userModel.countDocuments({
        role: 'super_admin',
      })
      if (superAdminCount <= 1) {
        throw new BadRequestException('不能降级最后一个超级管理员')
      }
    }

    const oldRole = user.role
    user.role = updateDto.role
    if (updateDto.customPermissions) {
      user.customPermissions = updateDto.customPermissions
    }

    await user.save()

    // 更新角色用户计数
    await this.roleService.updateUserCount(oldRole)
    await this.roleService.updateUserCount(updateDto.role)

    const { password, ...userWithoutPassword } = user.toObject()
    return userWithoutPassword
  }

  /**
   * 封禁/解封用户
   */
  async banUser(
    userId: string,
    banDto: BanUserDto,
    bannedBy: string,
  ): Promise<any> {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    // 不能封禁超级管理员
    if (user.role === 'super_admin') {
      throw new BadRequestException('不能封禁超级管理员')
    }

    user.isBanned = banDto.isBanned
    user.bannedReason = banDto.reason
    user.bannedBy = bannedBy
    user.bannedAt = banDto.isBanned ? new Date() : null

    await user.save()

    const { password, ...userWithoutPassword } = user.toObject()
    return userWithoutPassword
  }

  /**
   * 重置用户密码
   */
  async resetUserPassword(
    userId: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
    user.password = hashedPassword

    await user.save()
  }

  /**
   * 删除用户
   */
  async deleteUser(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    // 不能删除超级管理员
    if (user.role === 'super_admin') {
      const superAdminCount = await this.userModel.countDocuments({
        role: 'super_admin',
      })
      if (superAdminCount <= 1) {
        throw new BadRequestException('不能删除最后一个超级管理员')
      }
    }

    // 删除用户的所有问卷和答卷（可选，根据业务需求）
    // await this.questionModel.deleteMany({ author: user.username })
    // await this.answerModel.deleteMany({ username: user.username })

    await this.userModel.findByIdAndDelete(userId)

    // 更新角色用户计数
    await this.roleService.updateUserCount(user.role)
  }

  /**
   * 获取系统统计数据
   */
  async getSystemStatistics() {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
      totalUsers,
      todayNewUsers,
      totalQuestions,
      todayNewQuestions,
      totalAnswers,
      todayNewAnswers,
      usersByRole,
      userGrowth,
    ] = await Promise.all([
      // 总用户数
      this.userModel.countDocuments(),
      // 今日新增用户
      this.userModel.countDocuments({ createdAt: { $gte: todayStart } }),
      // 总问卷数
      this.questionModel.countDocuments(),
      // 今日新增问卷
      this.questionModel.countDocuments({ createdAt: { $gte: todayStart } }),
      // 总答卷数
      this.answerModel.countDocuments(),
      // 今日新增答卷
      this.answerModel.countDocuments({ createdAt: { $gte: todayStart } }),
      // 按角色统计用户
      this.userModel.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
          },
        },
      ]),
      // 用户增长趋势（最近30天）
      this.userModel.aggregate([
        {
          $match: {
            createdAt: { $gte: last30Days },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),
    ])

    return {
      users: {
        total: totalUsers,
        todayNew: todayNewUsers,
        byRole: usersByRole,
      },
      questions: {
        total: totalQuestions,
        todayNew: todayNewQuestions,
      },
      answers: {
        total: totalAnswers,
        todayNew: todayNewAnswers,
      },
      growth: {
        users: userGrowth,
      },
    }
  }

  /**
   * 获取用户活跃度统计
   */
  async getUserActivity(days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const activity = await this.userModel.aggregate([
      {
        $match: {
          lastLoginAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$lastLoginAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    return activity
  }
}

