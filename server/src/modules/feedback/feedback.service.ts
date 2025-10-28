import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Feedback, FeedbackDocument } from './schemas/feedback.schema'
import { CreateFeedbackDto } from './dto/create-feedback.dto'
import { UpdateFeedbackDto } from './dto/update-feedback.dto'
import { ReplyFeedbackDto } from './dto/reply-feedback.dto'
import { QueryFeedbackDto } from './dto/query-feedback.dto'

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name)
    private readonly feedbackModel: Model<FeedbackDocument>,
  ) {}

  /**
   * 创建反馈
   */
  async create(createDto: CreateFeedbackDto, author: string) {
    const feedback = new this.feedbackModel({
      ...createDto,
      author,
      status: 'pending',
    })

    await feedback.save()

    return {
      message: '反馈提交成功',
      _id: feedback._id,
    }
  }

  /**
   * 获取反馈列表
   */
  async findAll(query: QueryFeedbackDto) {
    const {
      type = 'all',
      status = 'all',
      priority = 'all',
      keyword,
      page = 1,
      pageSize = 20,
      sortBy = 'createdAt',
    } = query

    const filter: any = {}

    if (type && type !== 'all') {
      filter.type = type
    }

    if (status && status !== 'all') {
      filter.status = status
    }

    if (priority && priority !== 'all') {
      filter.priority = priority
    }

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { author: { $regex: keyword, $options: 'i' } },
      ]
    }

    // 排序
    const sort: any = {}
    if (sortBy === 'votes') {
      sort.votes = -1
    } else {
      sort.createdAt = -1
    }

    const [list, total] = await Promise.all([
      this.feedbackModel
        .find(filter)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean()
        .exec(),
      this.feedbackModel.countDocuments(filter).exec(),
    ])

    return {
      list,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    }
  }

  /**
   * 获取单个反馈详情
   */
  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的反馈ID')
    }

    const feedback = await this.feedbackModel.findById(id).lean().exec()

    if (!feedback) {
      throw new NotFoundException('反馈不存在')
    }

    return feedback
  }

  /**
   * 更新反馈状态（管理员）
   */
  async update(id: string, updateDto: UpdateFeedbackDto, adminUsername: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的反馈ID')
    }

    const feedback = await this.feedbackModel.findById(id).exec()

    if (!feedback) {
      throw new NotFoundException('反馈不存在')
    }

    // 更新状态
    if (updateDto.status) {
      feedback.status = updateDto.status

      // 如果标记为已解决
      if (updateDto.status === 'resolved') {
        feedback.resolvedAt = new Date()
        feedback.resolvedBy = adminUsername
      }
    }

    if (updateDto.priority) {
      feedback.priority = updateDto.priority
    }

    if (updateDto.assignedTo !== undefined) {
      feedback.assignedTo = updateDto.assignedTo
    }

    await feedback.save()

    return {
      message: '更新成功',
    }
  }

  /**
   * 回复反馈
   */
  async reply(id: string, replyDto: ReplyFeedbackDto, author: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的反馈ID')
    }

    const feedback = await this.feedbackModel.findById(id).exec()

    if (!feedback) {
      throw new NotFoundException('反馈不存在')
    }

    feedback.replies.push({
      content: replyDto.content,
      author,
      createdAt: new Date(),
    })

    await feedback.save()

    return {
      message: '回复成功',
    }
  }

  /**
   * 投票（功能请求）
   */
  async vote(id: string, username: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的反馈ID')
    }

    const feedback = await this.feedbackModel.findById(id).exec()

    if (!feedback) {
      throw new NotFoundException('反馈不存在')
    }

    if (feedback.type !== 'feature') {
      throw new BadRequestException('只有功能请求可以投票')
    }

    // 检查是否已投票
    if (feedback.voters.includes(username)) {
      throw new BadRequestException('您已经投过票了')
    }

    feedback.voters.push(username)
    feedback.votes += 1

    await feedback.save()

    return {
      message: '投票成功',
      votes: feedback.votes,
    }
  }

  /**
   * 取消投票
   */
  async unvote(id: string, username: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的反馈ID')
    }

    const feedback = await this.feedbackModel.findById(id).exec()

    if (!feedback) {
      throw new NotFoundException('反馈不存在')
    }

    if (!feedback.voters.includes(username)) {
      throw new BadRequestException('您还未投票')
    }

    feedback.voters = feedback.voters.filter((v) => v !== username)
    feedback.votes -= 1

    await feedback.save()

    return {
      message: '取消投票成功',
      votes: feedback.votes,
    }
  }

  /**
   * 删除反馈（管理员）
   */
  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的反馈ID')
    }

    const result = await this.feedbackModel.findByIdAndDelete(id).exec()

    if (!result) {
      throw new NotFoundException('反馈不存在')
    }

    return {
      message: '删除成功',
    }
  }

  /**
   * 获取统计数据
   */
  async getStatistics() {
    const [
      total,
      byType,
      byStatus,
      byPriority,
      topVoted,
      recentResolved,
    ] = await Promise.all([
      this.feedbackModel.countDocuments(),
      this.feedbackModel
        .aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }])
        .exec(),
      this.feedbackModel
        .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
        .exec(),
      this.feedbackModel
        .aggregate([
          { $match: { type: 'bug' } },
          { $group: { _id: '$priority', count: { $sum: 1 } } },
        ])
        .exec(),
      this.feedbackModel
        .find({ type: 'feature' })
        .sort({ votes: -1 })
        .limit(10)
        .select('title votes status')
        .lean()
        .exec(),
      this.feedbackModel
        .find({ status: 'resolved' })
        .sort({ resolvedAt: -1 })
        .limit(10)
        .select('title type resolvedAt resolvedBy')
        .lean()
        .exec(),
    ])

    return {
      total,
      byType: byType.map((item) => ({
        type: item._id,
        count: item.count,
      })),
      byStatus: byStatus.map((item) => ({
        status: item._id,
        count: item.count,
      })),
      byPriority: byPriority.map((item) => ({
        priority: item._id,
        count: item.count,
      })),
      topVoted,
      recentResolved,
    }
  }
}

