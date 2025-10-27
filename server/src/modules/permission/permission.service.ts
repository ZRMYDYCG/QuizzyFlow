import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Permission, PermissionDocument } from './schemas/permission.schema'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { QueryPermissionDto } from './dto/query-permission.dto'
import {
  PERMISSIONS,
  PERMISSION_DESCRIPTIONS,
  PERMISSIONS_BY_MODULE,
} from '../../common/constants/permissions'

/**
 * 权限服务
 */
@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
  ) {}

  /**
   * 初始化系统权限
   * 从常量文件中导入所有权限到数据库
   */
  async initializeSystemPermissions(): Promise<void> {
    const existingCount = await this.permissionModel.countDocuments()
    if (existingCount > 0) {
      return // 已经初始化过了
    }

    const permissions = Object.entries(PERMISSION_DESCRIPTIONS).map(
      ([code, info]) => {
        const [module, action] = code.split(':')
        return {
          code,
          name: info.name,
          description: info.description,
          module,
          action,
          isSystem: true,
          isActive: true,
          dependencies: [],
          createdBy: 'system',
        }
      },
    )

    await this.permissionModel.insertMany(permissions)
  }

  /**
   * 创建自定义权限
   */
  async create(
    createDto: CreatePermissionDto,
    createdBy: string,
  ): Promise<Permission> {
    const existing = await this.permissionModel.findOne({
      code: createDto.code,
    })
    if (existing) {
      throw new ConflictException('权限代码已存在')
    }

    const permission = new this.permissionModel({
      ...createDto,
      isSystem: false,
      createdBy,
    })

    return await permission.save()
  }

  /**
   * 获取所有权限
   */
  async findAll(queryDto: QueryPermissionDto): Promise<Permission[]> {
    const { module, action, isSystem, isActive, keyword } = queryDto

    const filter: any = {}

    if (module) {
      filter.module = module
    }

    if (action) {
      filter.action = action
    }

    if (isSystem !== undefined) {
      filter.isSystem = isSystem
    }

    if (isActive !== undefined) {
      filter.isActive = isActive
    }

    if (keyword) {
      filter.$or = [
        { code: { $regex: keyword, $options: 'i' } },
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ]
    }

    return await this.permissionModel
      .find(filter)
      .sort({ module: 1, action: 1 })
      .lean()
      .exec()
  }

  /**
   * 按模块分组获取权限
   */
  async findGroupedByModule(): Promise<Record<string, Permission[]>> {
    const permissions = await this.permissionModel
      .find({ isActive: true })
      .sort({ module: 1, action: 1 })
      .lean()
      .exec()

    const grouped: Record<string, Permission[]> = {}
    permissions.forEach((permission) => {
      if (!grouped[permission.module]) {
        grouped[permission.module] = []
      }
      grouped[permission.module].push(permission)
    })

    return grouped
  }

  /**
   * 获取单个权限
   */
  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionModel.findById(id).lean().exec()
    if (!permission) {
      throw new NotFoundException('权限不存在')
    }
    return permission
  }

  /**
   * 根据代码获取权限
   */
  async findByCode(code: string): Promise<Permission | null> {
    return await this.permissionModel.findOne({ code }).lean().exec()
  }

  /**
   * 批量根据代码获取权限
   */
  async findByCodes(codes: string[]): Promise<Permission[]> {
    return await this.permissionModel
      .find({ code: { $in: codes } })
      .lean()
      .exec()
  }

  /**
   * 更新权限
   */
  async update(
    id: string,
    updateDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.permissionModel.findById(id)
    if (!permission) {
      throw new NotFoundException('权限不存在')
    }

    // 系统权限不能修改代码
    if (permission.isSystem && updateDto.code !== undefined) {
      throw new BadRequestException('系统权限不能修改代码')
    }

    // 如果修改了代码，检查是否重复
    if (updateDto.code !== undefined && updateDto.code !== permission.code) {
      const existing = await this.permissionModel.findOne({
        code: updateDto.code,
      })
      if (existing) {
        throw new ConflictException('权限代码已存在')
      }
    }

    Object.assign(permission, updateDto)
    return await permission.save()
  }

  /**
   * 删除权限
   */
  async remove(id: string): Promise<void> {
    const permission = await this.permissionModel.findById(id)
    if (!permission) {
      throw new NotFoundException('权限不存在')
    }

    if (permission.isSystem) {
      throw new BadRequestException('系统权限不能删除')
    }

    await this.permissionModel.findByIdAndDelete(id)
  }

  /**
   * 获取权限统计
   */
  async getStatistics() {
    const [total, active, byModule] = await Promise.all([
      this.permissionModel.countDocuments(),
      this.permissionModel.countDocuments({ isActive: true }),
      this.permissionModel.aggregate([
        {
          $group: {
            _id: '$module',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]),
    ])

    return {
      total,
      active,
      byModule,
    }
  }

  /**
   * 验证权限代码数组
   */
  async validatePermissions(codes: string[]): Promise<{
    valid: string[]
    invalid: string[]
  }> {
    const permissions = await this.findByCodes(codes)
    const validCodes = permissions.map((p) => p.code)
    const invalid = codes.filter((code) => !validCodes.includes(code))

    return {
      valid: validCodes,
      invalid,
    }
  }
}

