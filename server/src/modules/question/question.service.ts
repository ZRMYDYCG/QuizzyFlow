import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { nanoid } from 'nanoid'
import { Question, QuestionDocument } from './schemas/question.schema'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import { QueryQuestionDto } from './dto/query-question.dto'

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  /**
   * 创建新问卷
   */
  async create(username: string, createDto?: CreateQuestionDto) {
    const defaultQuestion = {
      title: createDto?.title || `问卷标题_${Date.now()}`,
      desc: createDto?.desc || '问卷描述',
      author: username,
      componentList: createDto?.componentList || [
        {
          fe_id: nanoid(),
          type: 'question-info',
          title: '问卷信息',
          isHidden: false,
          isLocked: false,
          props: {
            title: '问卷标题',
            desc: '问卷描述...',
          },
        },
      ],
      js: createDto?.js || '',
      css: createDto?.css || '',
      isPublished: createDto?.isPublished || false,
      isStar: createDto?.isStar || false,
      selectedId: createDto?.selectedId || null,
      copiedComponent: createDto?.copiedComponent || null,
    }

    const question = new this.questionModel(defaultQuestion)
    return await question.save()
  }

  /**
   * 获取问卷列表（支持分页、搜索、筛选）
   */
  async findAll(username: string, query: QueryQuestionDto) {
    const {
      keyword = '',
      page = 1,
      pageSize = 10,
      isDeleted = false,
      isStar,
    } = query

    // 构建查询条件
    const filter: any = {
      author: username,
      isDeleted: isDeleted,
    }

    // 星标筛选
    if (isStar !== undefined) {
      filter.isStar = isStar
    }

    // 关键词搜索（标题或描述）
    if (keyword) {
      const reg = new RegExp(keyword, 'i')
      filter.$or = [{ title: reg }, { desc: reg }]
    }

    // 执行查询
    const [list, total] = await Promise.all([
      this.questionModel
        .find(filter)
        .select('-__v') // 排除 __v 字段
        .sort({ createdAt: -1 }) // 按创建时间倒序
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean()
        .exec(),
      this.questionModel.countDocuments(filter).exec(),
    ])

    return {
      list,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    }
  }

  /**
   * 获取单个问卷
   * 权限规则：
   * 1. 已发布的问卷：任何人都可以访问（包括未登录用户）
   * 2. 未发布的问卷：仅作者可以访问
   */
  async findOne(id: string, username?: string) {
    // 验证 ID 格式
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的问卷ID')
    }

    const question = await this.questionModel
      .findById(id)
      .select('-__v')
      .lean()
      .exec()

    if (!question) {
      throw new NotFoundException('问卷不存在')
    }

    // 权限验证
    // 如果问卷已发布，任何人都可以访问
    if (question.isPublished) {
      return question
    }

    // 如果问卷未发布，只有作者可以访问
    if (!username || question.author !== username) {
      throw new ForbiddenException('无权访问此问卷')
    }

    return question
  }

  /**
   * 更新问卷
   */
  async update(id: string, username: string, updateDto: UpdateQuestionDto) {
    // 验证 ID 格式
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的问卷ID')
    }

    // 查找问卷并验证权限
    const question = await this.questionModel.findById(id).exec()

    if (!question) {
      throw new NotFoundException('问卷不存在')
    }

    if (question.author !== username) {
      throw new ForbiddenException('无权修改此问卷')
    }

    // 更新问卷
    Object.assign(question, updateDto)
    await question.save()

    return question
  }

  /**
   * 批量删除（软删除）
   */
  async batchDelete(ids: string[], username: string) {
    // 验证所有 ID
    const invalidIds = ids.filter((id) => !Types.ObjectId.isValid(id))
    if (invalidIds.length > 0) {
      throw new BadRequestException(`无效的问卷ID: ${invalidIds.join(', ')}`)
    }

    // 批量软删除（只能删除自己的问卷）
    const result = await this.questionModel.updateMany(
      {
        _id: { $in: ids },
        author: username,
      },
      {
        $set: { 
          isDeleted: true,
          deletedAt: new Date(),
        },
      },
    )

    return {
      deletedCount: result.modifiedCount,
      message: `成功删除 ${result.modifiedCount} 个问卷`,
    }
  }

  /**
   * 复制问卷
   */
  async duplicate(id: string, username: string) {
    // 验证 ID 格式
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的问卷ID')
    }

    const question = await this.questionModel.findById(id).lean().exec()

    if (!question) {
      throw new NotFoundException('问卷不存在')
    }

    // 验证权限
    if (question.author !== username) {
      throw new ForbiddenException('无权复制此问卷')
    }

    // 创建副本
    const duplicated = new this.questionModel({
      ...question,
      _id: new Types.ObjectId(),
      title: `${question.title}_副本`,
      author: username,
      isPublished: false,
      isStar: false,
      isDeleted: false,
      // 重新生成所有组件的 fe_id
      componentList: question.componentList.map((component) => ({
        ...component,
        fe_id: nanoid(),
      })),
      selectedId: null,
      copiedComponent: null,
    })

    return await duplicated.save()
  }

  /**
   * 从回收站恢复
   */
  async restore(id: string, username: string) {
    // 验证 ID 格式
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的问卷ID')
    }

    const question = await this.questionModel.findById(id).exec()

    if (!question) {
      throw new NotFoundException('问卷不存在')
    }

    if (question.author !== username) {
      throw new ForbiddenException('无权恢复此问卷')
    }

    if (!question.isDeleted) {
      throw new BadRequestException('问卷未在回收站中')
    }

    question.isDeleted = false
    question.deletedAt = null
    await question.save()

    return {
      message: '问卷已恢复',
      data: question,
    }
  }

  /**
   * 永久删除
   */
  async permanentDelete(id: string, username: string) {
    // 验证 ID 格式
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的问卷ID')
    }

    const question = await this.questionModel.findById(id).exec()

    if (!question) {
      throw new NotFoundException('问卷不存在')
    }

    if (question.author !== username) {
      throw new ForbiddenException('无权删除此问卷')
    }

    await this.questionModel.findByIdAndDelete(id).exec()

    return {
      message: '问卷已永久删除',
    }
  }

  /**
   * 统计信息
   */
  async getStatistics(username: string) {
    const [total, published, starred, deleted] = await Promise.all([
      this.questionModel.countDocuments({ author: username }).exec(),
      this.questionModel
        .countDocuments({ author: username, isPublished: true })
        .exec(),
      this.questionModel
        .countDocuments({ author: username, isStar: true, isDeleted: false })
        .exec(),
      this.questionModel
        .countDocuments({ author: username, isDeleted: true })
        .exec(),
    ])

    return {
      total,
      published,
      starred,
      deleted,
      normal: total - deleted,
    }
  }
}
