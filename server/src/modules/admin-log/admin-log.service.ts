import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AdminLog, AdminLogDocument } from './schemas/admin-log.schema'
import { CreateAdminLogDto } from './dto/create-admin-log.dto'
import { QueryAdminLogDto } from './dto/query-admin-log.dto'

/**
 * 操作日志服务
 */
@Injectable()
export class AdminLogService {
  constructor(
    @InjectModel(AdminLog.name) private adminLogModel: Model<AdminLogDocument>,
  ) {}

  /**
   * 创建操作日志
   */
  async create(createDto: CreateAdminLogDto): Promise<AdminLog> {
    const log = new this.adminLogModel({
      ...createDto,
      operatedAt: new Date(),
    })
    return await log.save()
  }

  /**
   * 批量创建日志（用于批量操作）
   */
  async createBatch(logs: CreateAdminLogDto[]): Promise<void> {
    await this.adminLogModel.insertMany(
      logs.map((log) => ({
        ...log,
        operatedAt: new Date(),
      })),
    )
  }

  /**
   * 查询操作日志（分页）
   */
  async findAll(queryDto: QueryAdminLogDto) {
    const {
      page = 1,
      pageSize = 20,
      operatorId,
      module,
      action,
      resource,
      status,
      startDate,
      endDate,
      keyword,
    } = queryDto

    // 构建查询条件
    const filter: any = {}

    if (operatorId) {
      filter.operatorId = operatorId
    }

    if (module) {
      filter.module = module
    }

    if (action) {
      filter.action = action
    }

    if (resource) {
      filter.resource = resource
    }

    if (status) {
      filter.status = status
    }

    // 时间范围查询
    if (startDate || endDate) {
      filter.operatedAt = {}
      if (startDate) {
        filter.operatedAt.$gte = new Date(startDate)
      }
      if (endDate) {
        filter.operatedAt.$lte = new Date(endDate)
      }
    }

    // 关键词搜索（搜索操作人名称、资源名称等）
    if (keyword) {
      filter.$or = [
        { operatorName: { $regex: keyword, $options: 'i' } },
        { resourceName: { $regex: keyword, $options: 'i' } },
        { errorMessage: { $regex: keyword, $options: 'i' } },
      ]
    }

    // 分页查询
    const skip = (page - 1) * pageSize
    const [list, total] = await Promise.all([
      this.adminLogModel
        .find(filter)
        .sort({ operatedAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),
      this.adminLogModel.countDocuments(filter),
    ])

    return {
      list,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    }
  }

  /**
   * 获取单条日志详情
   */
  async findOne(id: string): Promise<AdminLog | null> {
    return await this.adminLogModel.findById(id).lean().exec()
  }

  /**
   * 删除指定时间之前的日志
   */
  async deleteBeforeDate(date: Date): Promise<number> {
    const result = await this.adminLogModel.deleteMany({
      operatedAt: { $lt: date },
    })
    return result.deletedCount
  }

  /**
   * 获取操作统计
   */
  async getStatistics(days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const stats = await this.adminLogModel.aggregate([
      {
        $match: {
          operatedAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            module: '$module',
            action: '$action',
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.module',
          actions: {
            $push: {
              action: '$_id.action',
              status: '$_id.status',
              count: '$count',
            },
          },
          totalCount: { $sum: '$count' },
        },
      },
      {
        $sort: { totalCount: -1 },
      },
    ])

    return stats
  }

  /**
   * 获取最近的操作日志
   */
  async getRecentLogs(limit: number = 10): Promise<AdminLog[]> {
    return await this.adminLogModel
      .find()
      .sort({ operatedAt: -1 })
      .limit(limit)
      .lean()
      .exec()
  }

  /**
   * 获取用户的操作历史
   */
  async getUserLogs(
    userId: string,
    limit: number = 50,
  ): Promise<AdminLog[]> {
    return await this.adminLogModel
      .find({ operatorId: userId })
      .sort({ operatedAt: -1 })
      .limit(limit)
      .lean()
      .exec()
  }
}

