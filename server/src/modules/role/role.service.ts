import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Role, RoleDocument } from './schemas/role.schema'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { QueryRoleDto } from './dto/query-role.dto'
import { User, UserDocument } from '../user/schemas/user.schema'
import { RbacService } from '../rbac/rbac.service'
import { normalizeStaffRolePermissions } from '../../common/constants/admin-assignable'
import {
  clampToRolePermissions,
  filterPermissionCodes,
  isStaffRole,
  resolveRolePermissionCeiling,
} from '../../common/utils/permission-bounds'

/**
 * 角色服务
 */
@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => RbacService))
    private rbacService: RbacService,
  ) {}

  /**
   * 创建角色
   */
  async create(createDto: CreateRoleDto, createdBy: string): Promise<Role> {
    // 检查角色名是否已存在
    const existing = await this.roleModel.findOne({ name: createDto.name })
    if (existing) {
      throw new ConflictException('角色名已存在')
    }

    const role = new this.roleModel({
      ...createDto,
      isSystem: false,
      userCount: 0,
      createdBy,
      updatedBy: createdBy,
    })

    return await role.save()
  }

  /**
   * 获取所有角色
   */
  async findAll(queryDto: QueryRoleDto): Promise<Role[]> {
    const { keyword, isSystem, isActive } = queryDto

    const filter: any = {}

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { displayName: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ]
    }

    if (isSystem !== undefined) {
      filter.isSystem = isSystem
    }

    if (isActive !== undefined) {
      filter.isActive = isActive
    }

    filter.deletedAt = null

    return await this.roleModel
      .find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .lean()
      .exec()
  }

  /**
   * 获取单个角色
   */
  async findOne(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id).lean().exec()
    if (!role || role.deletedAt) {
      throw new NotFoundException('角色不存在')
    }
    return role
  }

  /**
   * 根据名称获取角色
   */
  async findByName(name: string): Promise<Role | null> {
    const role = await this.roleModel
      .findOne({ name, deletedAt: null })
      .lean()
      .exec()
    if (!role) return null

    const ceiling = resolveRolePermissionCeiling(name, role.permissions || [])
    const stored = filterPermissionCodes(role.permissions || [])
    const needsSync =
      isStaffRole(name) &&
      (ceiling.length !== stored.length ||
        ceiling.some((p, i) => p !== stored[i]))

    if (needsSync) {
      await this.roleModel.updateOne(
        { name, deletedAt: null },
        { $set: { permissions: ceiling } },
      )
      await this.syncUsersPermissionsToRole(name, ceiling)
      return { ...role, permissions: ceiling }
    }

    return role
  }

  /**
   * 更新角色
   */
  async update(
    id: string,
    updateDto: UpdateRoleDto,
    updatedBy: string,
  ): Promise<Role> {
    const role = await this.roleModel.findById(id)
    if (!role || role.deletedAt) {
      throw new NotFoundException('角色不存在')
    }

    // 系统角色不能修改名称和优先级
    if (role.isSystem) {
      if (updateDto.name !== undefined && updateDto.name !== role.name) {
        throw new BadRequestException('系统角色不能修改名称')
      }
      if (updateDto.priority !== undefined && updateDto.priority !== role.priority) {
        throw new BadRequestException('系统角色不能修改优先级')
      }
    }

    // 如果修改了名称，检查是否重复
    if (updateDto.name !== undefined && updateDto.name !== role.name) {
      const existing = await this.roleModel.findOne({ name: updateDto.name })
      if (existing) {
        throw new ConflictException('角色名已存在')
      }
    }

    const permissionsTouched = updateDto.permissions !== undefined
    const patch = { ...updateDto }
    if (permissionsTouched) {
      patch.permissions = filterPermissionCodes(updateDto.permissions)
    }

    Object.assign(role, patch)
    role.updatedBy = updatedBy

    const saved = await role.save()
    if (permissionsTouched) {
      await this.syncUsersPermissionsToRole(saved.name, saved.permissions)
    }
    return saved
  }

  /**
   * 删除角色（软删除）
   */
  async remove(id: string): Promise<void> {
    const role = await this.roleModel.findById(id)
    if (!role || role.deletedAt) {
      throw new NotFoundException('角色不存在')
    }

    if (role.isSystem) {
      throw new BadRequestException('系统角色不能删除')
    }

    // 检查是否有用户使用该角色
    const userCount = await this.userModel.countDocuments({ role: role.name })
    if (userCount > 0) {
      throw new BadRequestException(`该角色正在被 ${userCount} 个用户使用，无法删除`)
    }

    role.deletedAt = new Date()
    await role.save()
  }

  /**
   * 添加权限到角色
   */
  async addPermissions(
    id: string,
    permissions: string[],
    updatedBy: string,
  ): Promise<Role> {
    const role = await this.roleModel.findById(id)
    if (!role || role.deletedAt) {
      throw new NotFoundException('角色不存在')
    }

    const merged = Array.from(new Set([...role.permissions, ...permissions]))
    const normalized = isStaffRole(role.name)
      ? normalizeStaffRolePermissions(filterPermissionCodes(merged))
      : filterPermissionCodes(merged)
    role.permissions = normalized
    role.updatedBy = updatedBy

    const saved = await role.save()
    await this.syncUsersPermissionsToRole(saved.name, normalized)
    return saved
  }

  /**
   * 移除角色的权限
   */
  async removePermissions(
    id: string,
    permissions: string[],
    updatedBy: string,
  ): Promise<Role> {
    const role = await this.roleModel.findById(id)
    if (!role || role.deletedAt) {
      throw new NotFoundException('角色不存在')
    }

    const merged = role.permissions.filter((p) => !permissions.includes(p))
    const normalized = isStaffRole(role.name)
      ? normalizeStaffRolePermissions(filterPermissionCodes(merged))
      : filterPermissionCodes(merged)
    role.permissions = normalized
    role.updatedBy = updatedBy

    const saved = await role.save()
    await this.syncUsersPermissionsToRole(saved.name, normalized)
    return saved
  }

  /**
   * 设置角色的所有权限
   */
  async setPermissions(
    id: string,
    permissions: string[],
    updatedBy: string,
  ): Promise<Role> {
    const role = await this.roleModel.findById(id)
    if (!role || role.deletedAt) {
      throw new NotFoundException('角色不存在')
    }

    const codes = filterPermissionCodes(permissions)
    const normalized = isStaffRole(role.name)
      ? normalizeStaffRolePermissions(codes)
      : codes
    role.permissions = normalized
    role.updatedBy = updatedBy

    const saved = await role.save()
    await this.syncUsersPermissionsToRole(saved.name, normalized)
    return saved
  }

  /**
   * 角色权限变更后，收回该角色下用户超出上限的操作权限
   */
  async syncUsersPermissionsToRole(
    roleName: string,
    rolePermissions: string[],
  ): Promise<void> {
    const users = await this.userModel.find({ role: roleName }).exec()

    for (const user of users) {
      const granted = user.grantedButtons?.length
        ? user.grantedButtons
        : user.customPermissions || []
      const next = clampToRolePermissions(granted, rolePermissions)

      if (
        next.length !== granted.length ||
        next.some((p, i) => p !== granted[i])
      ) {
        user.grantedButtons = next
        user.customPermissions = next
        await user.save()
        this.rbacService.clearUserCache(user._id.toString())
      }
    }
  }

  /**
   * 更新角色的用户数量
   */
  async updateUserCount(roleName: string): Promise<void> {
    const count = await this.userModel.countDocuments({ role: roleName })
    await this.roleModel.updateOne(
      { name: roleName },
      { $set: { userCount: count } },
    )
  }

  /**
   * 获取角色统计
   */
  async getStatistics() {
    const [total, active, custom, systemRoles] = await Promise.all([
      this.roleModel.countDocuments({ deletedAt: null }),
      this.roleModel.countDocuments({ deletedAt: null, isActive: true }),
      this.roleModel.countDocuments({ deletedAt: null, isSystem: false }),
      this.roleModel
        .find({ isSystem: true })
        .select('name displayName userCount')
        .lean()
        .exec(),
    ])

    return {
      total,
      active,
      custom,
      system: systemRoles.length,
      systemRoles,
    }
  }
}

