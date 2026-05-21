import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import { User, UserDocument } from '../user/schemas/user.schema'
import { Question, QuestionDocument } from '../question/schemas/question.schema'
import { Answer, AnswerDocument } from '../answer/schemas/answer.schema'
import { QueryUsersDto } from './dto/query-users.dto'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'
import { UpdateUserAccessDto } from './dto/update-user-access.dto'
import { UpdateAdminUserDto } from './dto/update-admin-user.dto'
import { ADMIN_ROUTE_REGISTRY, validateGrantedAccess } from '../../common/constants/access-registry'
import { getAdminPermissionCatalog } from '../../common/constants/admin-assignable'
import {
  clampToRolePermissions,
  isStaffRole,
  resolveRolePermissionCeiling,
} from '../../common/utils/permission-bounds'
import { RbacService } from '../rbac/rbac.service'
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
    private rbacService: RbacService,
  ) {}

  /**
   * 获取管理后台分配目录：页面路由 + 操作权限（分离）
   */
  getAccessRegistry() {
    return {
      routes: ADMIN_ROUTE_REGISTRY,
      permissions: getAdminPermissionCatalog(),
    }
  }

  /**
   * 获取某用户可分配权限上限（以其当前所属角色为准，实时读库）
   */
  async getUserAccessBounds(userId: string) {
    const user = await this.userModel.findById(userId).lean().exec()
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    const roleDoc = user.role
      ? await this.roleService.findByName(user.role)
      : null
    const rolePermissions = resolveRolePermissionCeiling(
      user.role,
      roleDoc?.permissions || [],
    )

    const grantedRaw =
      user.grantedButtons?.length > 0
        ? user.grantedButtons
        : user.customPermissions || []
    const grantedButtons = clampToRolePermissions(grantedRaw, rolePermissions)

    const catalog = getAdminPermissionCatalog()
    const assignableInCatalog = rolePermissions.filter((code) =>
      catalog.some((g) => g.items.some((i) => i.code === code)),
    )

    return {
      userId: user._id.toString(),
      role: user.role,
      roleDisplayName: roleDoc?.displayName || user.role,
      /** 与角色管理、分配弹窗一致的权限上限（已剔除普通用户侧权限） */
      rolePermissions: assignableInCatalog,
      rolePermissionCount: assignableInCatalog.length,
      grantedRoutes: user.grantedRoutes || [],
      grantedButtons,
      grantedButtonCount: grantedButtons.length,
      routes: ADMIN_ROUTE_REGISTRY,
      permissions: catalog,
    }
  }

  /**
   * 超级管理员为用户分配页面路由与操作权限
   */
  async updateUserAccess(
    userId: string,
    updateDto: UpdateUserAccessDto,
  ): Promise<any> {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    if (user.role === 'super_admin') {
      throw new BadRequestException('不能修改超级管理员的权限')
    }

    if (updateDto.role) {
      if (updateDto.role === 'admin') {
        const oldRole = user.role
        user.role = 'admin'
        if (oldRole !== 'admin') {
          await this.roleService.updateUserCount(oldRole)
          await this.roleService.updateUserCount('admin')
        }
      } else if (updateDto.role === 'user') {
        const oldRole = user.role
        user.role = 'user'
        user.grantedRoutes = []
        user.grantedButtons = []
        user.customPermissions = []
        if (oldRole !== 'user') {
          await this.roleService.updateUserCount(oldRole)
          await this.roleService.updateUserCount('user')
        }
      }
    }

    if (
      updateDto.grantedRoutes !== undefined ||
      updateDto.grantedButtons !== undefined
    ) {
      if (!isStaffRole(user.role)) {
        throw new BadRequestException(
          '仅管理后台员工可分配页面路由与操作权限',
        )
      }

      const roleDoc = await this.roleService.findByName(user.role)
      const rolePermissions = resolveRolePermissionCeiling(
      user.role,
      roleDoc?.permissions || [],
    )

      const validated = validateGrantedAccess(
        updateDto.grantedRoutes ?? user.grantedRoutes ?? [],
        updateDto.grantedButtons ?? user.grantedButtons ?? [],
      )
      const boundedButtons = clampToRolePermissions(
        validated.buttons,
        rolePermissions,
      )
      const rejected = validated.buttons.filter((p) => !boundedButtons.includes(p))
      if (rejected.length > 0) {
        throw new BadRequestException(
          `以下操作权限不在角色「${roleDoc?.displayName || user.role}」的权限范围内：${rejected.join(', ')}`,
        )
      }

      user.grantedRoutes = validated.routes
      user.grantedButtons = boundedButtons
      user.customPermissions = boundedButtons
    }

    await user.save()
    this.rbacService.clearUserCache(userId)

    const { password, ...userWithoutPassword } = user.toObject()
    return userWithoutPassword
  }

  private buildUsersFilter(queryDto: QueryUsersDto): Record<string, unknown> {
    const { keyword, role, isActive, isBanned } = queryDto
    const filter: Record<string, unknown> = {}

    if (keyword) {
      filter.$or = [
        { username: { $regex: keyword, $options: 'i' } },
        { nickname: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } },
      ]
    }
    if (role) filter.role = role
    if (isActive !== undefined) filter.isActive = isActive
    if (isBanned !== undefined) filter.isBanned = isBanned

    return filter
  }

  /**
   * 获取用户列表（分页）
   */
  async getUsers(queryDto: QueryUsersDto) {
    const {
      page = 1,
      pageSize = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryDto

    const filter = this.buildUsersFilter(queryDto)

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
  async getUserDetail(userId: string): Promise<any> {
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
   * 更新用户基本信息（管理员）
   */
  async updateUser(userId: string, updateDto: UpdateAdminUserDto): Promise<any> {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    if (user.role === 'super_admin') {
      throw new BadRequestException('不能修改超级管理员信息')
    }

    if (updateDto.nickname !== undefined) {
      user.nickname = updateDto.nickname.trim()
    }
    if (updateDto.phone !== undefined) {
      user.phone = updateDto.phone.trim()
    }
    if (updateDto.bio !== undefined) {
      user.bio = updateDto.bio.trim()
    }
    if (updateDto.isActive !== undefined) {
      user.isActive = updateDto.isActive
      if (updateDto.isActive) {
        user.isBanned = false
        user.bannedReason = ''
        user.bannedAt = null
        user.bannedBy = ''
      }
    }

    await user.save()

    const { password, ...userWithoutPassword } = user.toObject()
    return userWithoutPassword
  }

  /**
   * 导出用户数据（JSON 行，供前端生成 Excel）
   */
  async exportUsers(queryDto: QueryUsersDto) {
    const { sortBy = 'createdAt', sortOrder = 'desc' } = queryDto
    const filter = this.buildUsersFilter(queryDto)
    const sortOptions: Record<string, 1 | -1> = {}
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1

    const users = await this.userModel
      .find(filter)
      .select('-password')
      .sort(sortOptions)
      .limit(10000)
      .lean()
      .exec()

    const roleDocs = await this.roleService.findAll({})
    const roleNameMap = new Map(
      roleDocs.map((r) => [r.name, r.displayName || r.name]),
    )

    return users.map((u) => {
      const row = u as typeof u & { createdAt?: Date; updatedAt?: Date }
      return {
        用户名: row.username,
        昵称: row.nickname,
        角色: roleNameMap.get(row.role) || row.role,
        角色标识: row.role,
        手机号: row.phone || '',
        个人简介: row.bio || '',
        账号状态: row.isActive ? '正常' : '已停用',
        封禁状态: row.isBanned ? '已封禁' : '正常',
        封禁原因: row.bannedReason || '',
        已授权页面数:
          row.role === 'admin' ? (row.grantedRoutes?.length ?? 0) : '—',
        已授权操作权限数:
          row.role === 'admin'
            ? (row.grantedButtons?.length ?? row.customPermissions?.length ?? 0)
            : '—',
        最后登录: row.lastLoginAt
          ? new Date(row.lastLoginAt).toLocaleString('zh-CN')
          : '',
        注册时间: row.createdAt
          ? new Date(row.createdAt).toLocaleString('zh-CN')
          : '',
      }
    })
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

    if (createDto.role === 'super_admin') {
      throw new BadRequestException('不能创建超级管理员账号')
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

    if (user.role === 'super_admin') {
      throw new BadRequestException('不能修改超级管理员的角色或权限')
    }

    if (updateDto.role === 'super_admin') {
      throw new BadRequestException('不能将用户设置为超级管理员')
    }

    const oldRole = user.role
    user.role = updateDto.role

    const newRoleDoc = await this.roleService.findByName(updateDto.role)
    const newRolePermissions = resolveRolePermissionCeiling(
      updateDto.role,
      newRoleDoc?.permissions || [],
    )

    if (updateDto.customPermissions) {
      user.customPermissions = clampToRolePermissions(
        updateDto.customPermissions,
        newRolePermissions,
      )
    }

    const granted = user.grantedButtons?.length
      ? user.grantedButtons
      : user.customPermissions || []
    user.grantedButtons = clampToRolePermissions(granted, newRolePermissions)
    user.customPermissions = user.grantedButtons

    await user.save()
    this.rbacService.clearUserCache(userId)

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
    user.isActive = !banDto.isBanned // 停用就是封禁的意思
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

    if (user.role === 'super_admin') {
      throw new BadRequestException('不能删除超级管理员')
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

  /**
   * 获取所有问卷列表（管理员）
   */
  async getQuestions(query: any) {
    const {
      page = 1,
      pageSize = 20,
      keyword,
      status,
      type,
      author,
      isRecommended,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query

    // 构建查询条件
    const filter: any = {}

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { desc: { $regex: keyword, $options: 'i' } },
      ]
    }

    if (status === 'published') {
      filter.isPublished = true
    } else if (status === 'draft') {
      filter.isPublished = false
    }

    if (type) {
      filter.type = type
    }

    if (author) {
      filter.author = author
    }

    if (isRecommended !== undefined) {
      filter.isRecommended = isRecommended
    }

    // 不包括已删除的
    filter.isDeleted = false

    // 排序
    const sort: any = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1

    // 查询
    const [list, total] = await Promise.all([
      this.questionModel
        .find(filter)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      this.questionModel.countDocuments(filter),
    ])

    // 获取创建者信息
    const listWithAuthor = await Promise.all(
      list.map(async (question) => {
        const user = await this.userModel
          .findOne({ username: question.author })
          .select('username nickname')
          .lean()

        return {
          ...question,
          authorInfo: user,
        }
      }),
    )

    return {
      list: listWithAuthor,
      total,
      page,
      pageSize,
    }
  }

  /**
   * 获取问卷详情（管理员）
   */
  async getQuestionDetail(id: string) {
    const question = await this.questionModel.findById(id).lean()

    if (!question) {
      throw new NotFoundException('问卷不存在')
    }

    // 获取创建者信息
    const user = await this.userModel
      .findOne({ username: question.author })
      .select('username nickname email phone')
      .lean()

    // 获取答卷数量
    const answerCount = await this.answerModel.countDocuments({
      questionId: id,
    })

    return {
      ...question,
      authorInfo: user,
      answerCount,
    }
  }

  /**
   * 更新问卷状态（发布/下架）
   */
  async updateQuestionStatus(id: string, updateDto: any, operator: string) {
    const question = await this.questionModel.findById(id)

    if (!question) {
      throw new NotFoundException('问卷不存在')
    }

    const { isPublished, reason } = updateDto

    if (isPublished !== undefined) {
      question.isPublished = isPublished
    }

    await question.save()

    return {
      message: isPublished ? '问卷已发布' : '问卷已下架',
      question,
    }
  }

  /**
   * 批量删除问卷（管理员）
   */
  async batchDeleteQuestions(ids: string[]) {
    const invalidIds = ids.filter((id) => !Types.ObjectId.isValid(id))
    if (invalidIds.length > 0) {
      throw new BadRequestException(`无效的问卷ID: ${invalidIds.join(', ')}`)
    }

    const result = await this.questionModel.deleteMany({ _id: { $in: ids } })
    await this.answerModel.deleteMany({ questionId: { $in: ids } })

    return {
      deletedCount: result.deletedCount,
      message: `成功删除 ${result.deletedCount} 个问卷`,
    }
  }

  /**
   * 删除问卷（管理员）
   */
  async deleteQuestion(id: string, operator: string) {
    const question = await this.questionModel.findById(id)

    if (!question) {
      throw new NotFoundException('问卷不存在')
    }

    // 硬删除
    await this.questionModel.findByIdAndDelete(id)

    // 同时删除相关的答卷
    await this.answerModel.deleteMany({ questionId: id })

    return {
      message: '问卷已永久删除',
    }
  }

  /**
   * 设置问卷为推荐
   */
  async setQuestionRecommended(
    id: string,
    isRecommended: boolean,
    operator: string,
  ) {
    const question = await this.questionModel.findById(id)

    if (!question) {
      throw new NotFoundException('问卷不存在')
    }

    question.isRecommended = isRecommended
    await question.save()

    return {
      message: isRecommended ? '已设为推荐' : '已取消推荐',
      question,
    }
  }

  /**
   * 获取问卷统计数据
   */
  async getQuestionStatistics() {
    const [total, published, draft, recommended] = await Promise.all([
      this.questionModel.countDocuments({ isDeleted: false }),
      this.questionModel.countDocuments({
        isDeleted: false,
        isPublished: true,
      }),
      this.questionModel.countDocuments({
        isDeleted: false,
        isPublished: false,
      }),
      this.questionModel.countDocuments({
        isDeleted: false,
        isRecommended: true,
      }),
    ])

    return {
      total,
      published,
      draft,
      recommended,
    }
  }
}

