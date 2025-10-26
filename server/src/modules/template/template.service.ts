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
}

