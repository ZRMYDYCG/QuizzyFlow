import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import {
  ModerationRecord,
  ModerationRecordDocument,
} from './schemas/moderation-record.schema'
import {
  SensitiveWord,
  SensitiveWordDocument,
} from './schemas/sensitive-word.schema'
import { Question, QuestionDocument } from '../question/schemas/question.schema'
import { Template, TemplateDocument } from '../template/schemas/template.schema'
import { QueryModerationDto } from './dto/query-moderation.dto'
import { ReviewContentDto } from './dto/review-content.dto'
import { BatchReviewDto } from './dto/batch-review.dto'
import { CreateSensitiveWordDto } from './dto/create-sensitive-word.dto'

@Injectable()
export class ModerationService {
  constructor(
    @InjectModel(ModerationRecord.name)
    private readonly moderationModel: Model<ModerationRecordDocument>,
    @InjectModel(SensitiveWord.name)
    private readonly sensitiveWordModel: Model<SensitiveWordDocument>,
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
    @InjectModel(Template.name)
    private readonly templateModel: Model<TemplateDocument>,
  ) {}

  /**
   * 自动审核内容
   * 这个方法会在问卷/模板创建时自动调用
   */
  async autoReviewContent(
    contentType: 'question' | 'template',
    contentId: string,
    content: {
      title: string
      description?: string
      author: string
    },
  ) {
    // 1. 获取所有活跃的敏感词
    const sensitiveWords = await this.sensitiveWordModel
      .find({ isActive: true })
      .lean()
      .exec()

    // 2. 检测敏感词
    const textToCheck = `${content.title} ${content.description || ''}`.toLowerCase()
    const detectedKeywords: string[] = []
    let maxSeverity = 'low'

    for (const sw of sensitiveWords) {
      if (textToCheck.includes(sw.word.toLowerCase())) {
        detectedKeywords.push(sw.word)
        if (sw.severity === 'high') maxSeverity = 'high'
        else if (sw.severity === 'medium' && maxSeverity === 'low')
          maxSeverity = 'medium'
      }
    }

    // 3. 计算风险评分
    const riskScore = this.calculateRiskScore(
      detectedKeywords.length,
      maxSeverity,
      content.title.length,
    )

    // 4. 确定风险等级
    const riskLevel = this.getRiskLevel(riskScore, detectedKeywords.length)

    // 5. 自动决策
    let status = 'pending'
    let isAutoReviewed = false

    if (riskLevel === 'low' && detectedKeywords.length === 0) {
      // 低风险且无敏感词：自动通过
      status = 'auto_approved'
      isAutoReviewed = true
      await this.approveContent(contentType, contentId)
    } else if (riskLevel === 'high' || detectedKeywords.length > 3) {
      // 高风险或敏感词过多：需人工审核
      status = 'pending'
    } else {
      // 中风险：延迟人工审核
      status = 'pending'
    }

    // 6. 创建审核记录
    const record = new this.moderationModel({
      contentType,
      contentId: new Types.ObjectId(contentId),
      contentTitle: content.title,
      author: content.author,
      status,
      riskLevel,
      detectedKeywords,
      riskScore,
      isAutoReviewed,
    })

    await record.save()

    return {
      status,
      riskLevel,
      riskScore,
      detectedKeywords,
      needsReview: status === 'pending',
    }
  }

  /**
   * 计算风险评分 (0-100)
   */
  private calculateRiskScore(
    keywordCount: number,
    maxSeverity: string,
    titleLength: number,
  ): number {
    let score = 0

    // 敏感词数量
    score += keywordCount * 15

    // 严重程度
    if (maxSeverity === 'high') score += 40
    else if (maxSeverity === 'medium') score += 20
    else score += 5

    // 标题长度异常（太短或太长）
    if (titleLength < 5) score += 15
    else if (titleLength > 100) score += 10

    return Math.min(score, 100)
  }

  /**
   * 确定风险等级
   */
  private getRiskLevel(riskScore: number, keywordCount: number): string {
    if (riskScore >= 50 || keywordCount > 3) return 'high'
    if (riskScore >= 25 || keywordCount > 0) return 'medium'
    return 'low'
  }

  /**
   * 自动通过内容
   */
  private async approveContent(contentType: string, contentId: string) {
    if (contentType === 'question') {
      await this.questionModel.findByIdAndUpdate(contentId, {
        isPublished: true,
      })
    } else if (contentType === 'template') {
      await this.templateModel.findByIdAndUpdate(contentId, {
        isPublic: true,
        approvalStatus: 'approved',
      })
    }
  }

  /**
   * 获取待审核队列
   */
  async getPendingQueue(query: QueryModerationDto) {
    const {
      status = 'pending',
      contentType = 'all',
      riskLevel = 'all',
      keyword,
      page = 1,
      pageSize = 20,
    } = query

    const filter: any = {}

    if (status && status !== 'all') {
      filter.status = status
    }

    if (contentType && contentType !== 'all') {
      filter.contentType = contentType
    }

    if (riskLevel && riskLevel !== 'all') {
      filter.riskLevel = riskLevel
    }

    if (keyword) {
      filter.$or = [
        { contentTitle: { $regex: keyword, $options: 'i' } },
        { author: { $regex: keyword, $options: 'i' } },
      ]
    }

    const [list, total] = await Promise.all([
      this.moderationModel
        .find(filter)
        .sort({ riskLevel: -1, createdAt: -1 }) // 高风险优先
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean()
        .exec(),
      this.moderationModel.countDocuments(filter).exec(),
    ])

    return {
      list,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    }
  }

  /**
   * 人工审核（通过/拒绝）
   */
  async reviewContent(
    id: string,
    reviewDto: ReviewContentDto,
    reviewerUsername: string,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的审核记录ID')
    }

    const record = await this.moderationModel.findById(id).exec()

    if (!record) {
      throw new NotFoundException('审核记录不存在')
    }

    if (record.status !== 'pending') {
      throw new BadRequestException('该内容已审核，无法重复审核')
    }

    // 更新审核状态
    record.status = reviewDto.action === 'approve' ? 'approved' : 'rejected'
    record.reviewedBy = reviewerUsername
    record.reviewedAt = new Date()

    if (reviewDto.action === 'reject' && reviewDto.reason) {
      record.rejectionReason = reviewDto.reason
    }

    await record.save()

    // 更新对应内容的状态
    if (reviewDto.action === 'approve') {
      await this.approveContent(record.contentType, record.contentId.toString())
    } else {
      // 拒绝时，更新内容状态
      if (record.contentType === 'question') {
        await this.questionModel.findByIdAndUpdate(record.contentId, {
          isPublished: false,
        })
      } else if (record.contentType === 'template') {
        await this.templateModel.findByIdAndUpdate(record.contentId, {
          approvalStatus: 'rejected',
          rejectionReason: reviewDto.reason,
        })
      }
    }

    return {
      message: reviewDto.action === 'approve' ? '审核通过' : '已拒绝',
    }
  }

  /**
   * 批量审核
   */
  async batchReview(
    batchDto: BatchReviewDto,
    reviewerUsername: string,
  ) {
    const { ids, action, reason } = batchDto

    const validIds = ids.filter((id) => Types.ObjectId.isValid(id))

    if (validIds.length === 0) {
      throw new BadRequestException('没有有效的审核记录ID')
    }

    const records = await this.moderationModel
      .find({
        _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
        status: 'pending',
      })
      .exec()

    let processedCount = 0

    for (const record of records) {
      record.status = action === 'approve' ? 'approved' : 'rejected'
      record.reviewedBy = reviewerUsername
      record.reviewedAt = new Date()

      if (action === 'reject' && reason) {
        record.rejectionReason = reason
      }

      await record.save()

      // 更新内容状态
      if (action === 'approve') {
        await this.approveContent(record.contentType, record.contentId.toString())
      } else {
        if (record.contentType === 'question') {
          await this.questionModel.findByIdAndUpdate(record.contentId, {
            isPublished: false,
          })
        } else if (record.contentType === 'template') {
          await this.templateModel.findByIdAndUpdate(record.contentId, {
            approvalStatus: 'rejected',
            rejectionReason: reason,
          })
        }
      }

      processedCount++
    }

    return {
      message: `成功${action === 'approve' ? '通过' : '拒绝'} ${processedCount} 条内容`,
      processedCount,
    }
  }

  /**
   * 获取审核统计
   */
  async getStatistics() {
    const [
      total,
      pending,
      approved,
      rejected,
      autoApproved,
      byRiskLevel,
      byContentType,
    ] = await Promise.all([
      this.moderationModel.countDocuments(),
      this.moderationModel.countDocuments({ status: 'pending' }),
      this.moderationModel.countDocuments({ status: 'approved' }),
      this.moderationModel.countDocuments({ status: 'rejected' }),
      this.moderationModel.countDocuments({ status: 'auto_approved' }),
      this.moderationModel
        .aggregate([
          { $group: { _id: '$riskLevel', count: { $sum: 1 } } },
        ])
        .exec(),
      this.moderationModel
        .aggregate([
          { $group: { _id: '$contentType', count: { $sum: 1 } } },
        ])
        .exec(),
    ])

    // 计算自动审核率
    const autoApprovalRate = total > 0 ? ((autoApproved / total) * 100).toFixed(1) : '0'

    return {
      total,
      pending,
      approved,
      rejected,
      autoApproved,
      autoApprovalRate,
      byRiskLevel: byRiskLevel.map((item) => ({
        riskLevel: item._id,
        count: item.count,
      })),
      byContentType: byContentType.map((item) => ({
        contentType: item._id,
        count: item.count,
      })),
    }
  }

  // ==================== 敏感词管理 ====================

  /**
   * 获取敏感词列表
   */
  async getSensitiveWords(page = 1, pageSize = 50) {
    const [list, total] = await Promise.all([
      this.sensitiveWordModel
        .find()
        .sort({ severity: -1, createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean()
        .exec(),
      this.sensitiveWordModel.countDocuments().exec(),
    ])

    return {
      list,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    }
  }

  /**
   * 添加敏感词
   */
  async addSensitiveWord(dto: CreateSensitiveWordDto, addedBy: string) {
    // 检查是否已存在
    const existing = await this.sensitiveWordModel
      .findOne({ word: dto.word })
      .exec()

    if (existing) {
      throw new BadRequestException('该敏感词已存在')
    }

    const sensitiveWord = new this.sensitiveWordModel({
      ...dto,
      addedBy,
    })

    await sensitiveWord.save()

    return {
      message: '敏感词添加成功',
      _id: sensitiveWord._id,
    }
  }

  /**
   * 删除敏感词
   */
  async deleteSensitiveWord(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的敏感词ID')
    }

    const result = await this.sensitiveWordModel.findByIdAndDelete(id).exec()

    if (!result) {
      throw new NotFoundException('敏感词不存在')
    }

    return {
      message: '敏感词删除成功',
    }
  }

  /**
   * 批量导入敏感词
   */
  async batchImportSensitiveWords(
    words: CreateSensitiveWordDto[],
    addedBy: string,
  ) {
    let successCount = 0
    let failCount = 0

    for (const wordDto of words) {
      try {
        const existing = await this.sensitiveWordModel
          .findOne({ word: wordDto.word })
          .exec()

        if (!existing) {
          await this.sensitiveWordModel.create({
            ...wordDto,
            addedBy,
          })
          successCount++
        } else {
          failCount++
        }
      } catch (error) {
        failCount++
      }
    }

    return {
      message: `导入完成：成功 ${successCount} 个，失败 ${failCount} 个`,
      successCount,
      failCount,
    }
  }
}

