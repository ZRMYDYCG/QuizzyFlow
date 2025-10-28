import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Template } from './schemas/template.schema'
import { CreateTemplateDto } from './dto/create-template.dto'
import { User, UserDocument } from '../user/schemas/user.schema'

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(Template.name) private templateModel: Model<Template>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // 获取模板列表
  async getTemplateList(query: any) {
    const {
      page = 1,
      pageSize = 12,
      category,
      type,
      keyword,
      sortBy = 'popular',
      isOfficial,
      isFeatured,
    } = query

    const filter: any = { isPublic: true }

    if (category && category !== 'all') {
      filter.category = category
    }

    if (type) {
      filter.type = type
    }

    if (isOfficial !== undefined) {
      filter.isOfficial = isOfficial === 'true'
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true'
    }

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } },
      ]
    }

    // 排序
    let sort: any = {}
    switch (sortBy) {
      case 'latest':
        sort = { createdAt: -1 }
        break
      case 'most_used':
        sort = { useCount: -1 }
        break
      case 'rated':
        sort = { rating: -1, likeCount: -1 }
        break
      case 'popular':
      default:
        sort = { likeCount: -1, useCount: -1 }
        break
    }

    const skip = (page - 1) * pageSize
    const list = await this.templateModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .exec()

    const total = await this.templateModel.countDocuments(filter)

    return {
      list,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    }
  }

  // 获取精选模板
  async getFeaturedTemplates(limit: number = 6) {
    return await this.templateModel
      .find({ isPublic: true, isFeatured: true })
      .sort({ likeCount: -1 })
      .limit(limit)
      .exec()
  }

  // 获取最新模板
  async getLatestTemplates(limit: number = 6) {
    return await this.templateModel
      .find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec()
  }

  // 获取我的模板
  async getMyTemplates(username: string, query: any) {
    const { page = 1, pageSize = 12 } = query
    const skip = (page - 1) * pageSize

    const filter = { author: username }
    const list = await this.templateModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .exec()

    const total = await this.templateModel.countDocuments(filter)

    return {
      list,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    }
  }

  // 获取模板详情
  async getTemplateDetail(id: string) {
    const template = await this.templateModel.findById(id)
    if (!template) {
      throw new NotFoundException('模板不存在')
    }

    // 增加浏览次数
    await this.templateModel.findByIdAndUpdate(id, {
      $inc: { viewCount: 1 },
    })

    return template
  }

  // 创建模板
  async createTemplate(username: string, nickname: string, avatar: string, createTemplateDto: CreateTemplateDto) {
    const template = await this.templateModel.create({
      ...createTemplateDto,
      author: username,
      authorNickname: nickname,
      authorAvatar: avatar,
      isOfficial: false,
      isFeatured: false,
      useCount: 0,
      likeCount: 0,
      viewCount: 0,
      rating: 5,
    })

    return template
  }

  // 更新模板
  async updateTemplate(id: string, username: string, updateData: Partial<CreateTemplateDto>) {
    const template = await this.templateModel.findById(id)
    if (!template) {
      throw new NotFoundException('模板不存在')
    }

    if (template.author !== username) {
      throw new ForbiddenException('无权限修改此模板')
    }

    Object.assign(template, updateData)
    await template.save()

    return template
  }

  // 删除模板
  async deleteTemplate(id: string, username: string) {
    const template = await this.templateModel.findById(id)
    if (!template) {
      throw new NotFoundException('模板不存在')
    }

    if (template.author !== username) {
      throw new ForbiddenException('无权限删除此模板')
    }

    await this.templateModel.findByIdAndDelete(id)
    return { message: '删除成功' }
  }

  // 增加使用次数
  async incrementUseCount(id: string) {
    await this.templateModel.findByIdAndUpdate(id, {
      $inc: { useCount: 1 },
    })
    return { message: '使用成功' }
  }

  // 增加点赞数
  async incrementLikeCount(id: string) {
    await this.templateModel.findByIdAndUpdate(id, {
      $inc: { likeCount: 1 },
    })
    return { message: '点赞成功' }
  }

  // 减少点赞数
  async decrementLikeCount(id: string) {
    await this.templateModel.findByIdAndUpdate(id, {
      $inc: { likeCount: -1 },
    })
    return { message: '取消点赞成功' }
  }

  // 获取用户信息（用于获取头像）
  async getUserInfo(userId: string) {
    const user = await this.userModel.findById(userId).lean().exec()
    return user || { avatar: '' }
  }

  // ==================== 管理员方法 ====================

  // 获取所有模板（管理员）
  async getAdminTemplateList(query: any) {
    const {
      page = 1,
      pageSize = 20,
      keyword,
      category,
      type,
      author,
      isOfficial,
      isFeatured,
      approvalStatus,
      sortBy = 'createdAt',
    } = query

    const filter: any = {}

    // 筛选条件
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ]
    }

    if (category) filter.category = category
    if (type) filter.type = type
    if (author) filter.author = author
    if (isOfficial !== undefined) filter.isOfficial = isOfficial === 'true'
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true'
    if (approvalStatus) filter.approvalStatus = approvalStatus

    // 排序
    let sort: any = {}
    switch (sortBy) {
      case 'latest':
        sort = { createdAt: -1 }
        break
      case 'useCount':
        sort = { useCount: -1 }
        break
      case 'likeCount':
        sort = { likeCount: -1 }
        break
      default:
        sort = { createdAt: -1 }
    }

    const skip = (page - 1) * pageSize
    const list = await this.templateModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .lean()
      .exec()

    const total = await this.templateModel.countDocuments(filter)

    return {
      list,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    }
  }

  // 审核模板
  async approveTemplate(id: string, action: 'approve' | 'reject', adminUsername: string, reason?: string) {
    const template = await this.templateModel.findById(id)
    if (!template) {
      throw new NotFoundException('模板不存在')
    }

    if (action === 'approve') {
      template.approvalStatus = 'approved'
      template.approvedAt = new Date()
      template.approvedBy = adminUsername
      template.rejectionReason = ''
    } else {
      template.approvalStatus = 'rejected'
      template.rejectionReason = reason || '不符合规范'
      template.approvedAt = undefined
      template.approvedBy = undefined
    }

    await template.save()
    return template
  }

  // 设置为官方模板
  async setOfficial(id: string, isOfficial: boolean) {
    const template = await this.templateModel.findByIdAndUpdate(
      id,
      { isOfficial },
      { new: true }
    )

    if (!template) {
      throw new NotFoundException('模板不存在')
    }

    return template
  }

  // 设置为精选模板
  async setFeatured(id: string, isFeatured: boolean) {
    const template = await this.templateModel.findByIdAndUpdate(
      id,
      { isFeatured },
      { new: true }
    )

    if (!template) {
      throw new NotFoundException('模板不存在')
    }

    return template
  }

  // 批量删除模板
  async batchDeleteTemplates(ids: string[]) {
    const result = await this.templateModel.deleteMany({
      _id: { $in: ids },
    })

    return {
      message: `成功删除 ${result.deletedCount} 个模板`,
      deletedCount: result.deletedCount,
    }
  }

  // 批量设置精选
  async batchSetFeatured(ids: string[], isFeatured: boolean) {
    const result = await this.templateModel.updateMany(
      { _id: { $in: ids } },
      { isFeatured }
    )

    return {
      message: `成功更新 ${result.modifiedCount} 个模板`,
      modifiedCount: result.modifiedCount,
    }
  }

  // 获取模板统计数据
  async getTemplateStatistics() {
    const [
      total,
      official,
      userCreated,
      featured,
      pending,
      approved,
      rejected,
      byCategory,
      topTemplates,
    ] = await Promise.all([
      // 总数
      this.templateModel.countDocuments(),
      
      // 官方模板数
      this.templateModel.countDocuments({ isOfficial: true }),
      
      // 用户创建数
      this.templateModel.countDocuments({ isOfficial: false }),
      
      // 精选模板数
      this.templateModel.countDocuments({ isFeatured: true }),
      
      // 待审核
      this.templateModel.countDocuments({ approvalStatus: 'pending' }),
      
      // 已通过
      this.templateModel.countDocuments({ approvalStatus: 'approved' }),
      
      // 已拒绝
      this.templateModel.countDocuments({ approvalStatus: 'rejected' }),
      
      // 按分类统计
      this.templateModel.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            avgUseCount: { $avg: '$useCount' },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]),
      
      // Top 10 模板
      this.templateModel
        .find()
        .sort({ useCount: -1, likeCount: -1 })
        .limit(10)
        .select('name useCount likeCount viewCount rating author')
        .lean()
        .exec(),
    ])

    return {
      total,
      official,
      userCreated,
      featured,
      pending,
      approved,
      rejected,
      byCategory,
      topTemplates,
    }
  }

  // 更新模板管理属性（管理员专用）
  async updateTemplateAdmin(id: string, updateData: any) {
    const template = await this.templateModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )

    if (!template) {
      throw new NotFoundException('模板不存在')
    }

    return template
  }
}

