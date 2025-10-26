import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Role, RoleDocument } from '../role/schemas/role.schema'
import {
  Permission,
  PermissionDocument,
} from '../permission/schemas/permission.schema'
import { User, UserDocument } from '../user/schemas/user.schema'

/**
 * RBAC 服务
 * 负责权限验证和管理的核心服务
 */
@Injectable()
export class RbacService {
  private readonly logger = new Logger(RbacService.name)
  
  // 权限缓存
  private permissionsCache: Map<string, string[]> = new Map()
  private cacheExpiry: Map<string, number> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5分钟缓存

  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * 获取用户的所有权限
   * @param userId 用户ID
   * @returns 权限代码数组
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    try {
      // 检查缓存
      const cached = this.getFromCache(userId)
      if (cached) {
        return cached
      }

      // 查询用户
      const user = await this.userModel.findById(userId).lean().exec()
      if (!user) {
        return []
      }

      // super_admin 拥有所有权限
      if (user.role === 'super_admin') {
        const allPermissions = await this.getAllPermissionCodes()
        this.setCache(userId, allPermissions)
        return allPermissions
      }

      // 获取角色权限
      const role = await this.roleModel
        .findOne({ name: user.role, isActive: true })
        .lean()
        .exec()

      const rolePermissions = role?.permissions || []

      // 合并用户自定义权限
      const customPermissions = user.customPermissions || []
      const allPermissions = [...new Set([...rolePermissions, ...customPermissions])]

      // 缓存结果
      this.setCache(userId, allPermissions)

      return allPermissions
    } catch (error) {
      this.logger.error(`获取用户权限失败: ${error.message}`, error.stack)
      return []
    }
  }

  /**
   * 检查用户是否拥有指定权限
   * @param userId 用户ID
   * @param permission 权限代码
   * @returns 是否拥有权限
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId)
    return permissions.includes(permission)
  }

  /**
   * 检查用户是否拥有所有指定权限
   * @param userId 用户ID
   * @param permissions 权限代码数组
   * @returns 是否拥有所有权限
   */
  async hasAllPermissions(
    userId: string,
    permissions: string[],
  ): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId)
    return permissions.every((p) => userPermissions.includes(p))
  }

  /**
   * 检查用户是否拥有任一指定权限
   * @param userId 用户ID
   * @param permissions 权限代码数组
   * @returns 是否拥有任一权限
   */
  async hasAnyPermission(
    userId: string,
    permissions: string[],
  ): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId)
    return permissions.some((p) => userPermissions.includes(p))
  }

  /**
   * 检查用户角色
   * @param userId 用户ID
   * @param role 角色名称
   * @returns 是否拥有该角色
   */
  async hasRole(userId: string, role: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).lean().exec()
    return user?.role === role
  }

  /**
   * 检查用户是否拥有任一角色
   * @param userId 用户ID
   * @param roles 角色名称数组
   * @returns 是否拥有任一角色
   */
  async hasAnyRole(userId: string, roles: string[]): Promise<boolean> {
    const user = await this.userModel.findById(userId).lean().exec()
    return roles.includes(user?.role)
  }

  /**
   * 获取角色的所有权限
   * @param roleName 角色名称
   * @returns 权限代码数组
   */
  async getRolePermissions(roleName: string): Promise<string[]> {
    const role = await this.roleModel
      .findOne({ name: roleName, isActive: true })
      .lean()
      .exec()

    return role?.permissions || []
  }

  /**
   * 获取所有权限代码
   * @returns 权限代码数组
   */
  async getAllPermissionCodes(): Promise<string[]> {
    const permissions = await this.permissionModel
      .find({ isActive: true })
      .select('code')
      .lean()
      .exec()

    return permissions.map((p) => p.code)
  }

  /**
   * 清除用户权限缓存
   * @param userId 用户ID
   */
  clearUserCache(userId: string): void {
    this.permissionsCache.delete(userId)
    this.cacheExpiry.delete(userId)
  }

  /**
   * 清除所有权限缓存
   */
  clearAllCache(): void {
    this.permissionsCache.clear()
    this.cacheExpiry.clear()
  }

  /**
   * 从缓存获取权限
   */
  private getFromCache(userId: string): string[] | null {
    const expiry = this.cacheExpiry.get(userId)
    if (!expiry || Date.now() > expiry) {
      this.permissionsCache.delete(userId)
      this.cacheExpiry.delete(userId)
      return null
    }

    return this.permissionsCache.get(userId) || null
  }

  /**
   * 设置缓存
   */
  private setCache(userId: string, permissions: string[]): void {
    this.permissionsCache.set(userId, permissions)
    this.cacheExpiry.set(userId, Date.now() + this.CACHE_TTL)
  }

  /**
   * 验证权限依赖
   * @param permissionCode 权限代码
   * @param userPermissions 用户权限列表
   * @returns 是否满足依赖
   */
  async validatePermissionDependencies(
    permissionCode: string,
    userPermissions: string[],
  ): Promise<boolean> {
    const permission = await this.permissionModel
      .findOne({ code: permissionCode })
      .lean()
      .exec()

    if (!permission || !permission.dependencies?.length) {
      return true
    }

    return permission.dependencies.every((dep) =>
      userPermissions.includes(dep),
    )
  }

  /**
   * 比较角色优先级
   * @param role1 角色1
   * @param role2 角色2
   * @returns role1 优先级是否高于 role2
   */
  async isRoleHigherPriority(
    role1: string,
    role2: string,
  ): Promise<boolean> {
    const [r1, r2] = await Promise.all([
      this.roleModel.findOne({ name: role1 }).lean().exec(),
      this.roleModel.findOne({ name: role2 }).lean().exec(),
    ])

    const priority1 = r1?.priority || 0
    const priority2 = r2?.priority || 0

    return priority1 > priority2
  }
}

