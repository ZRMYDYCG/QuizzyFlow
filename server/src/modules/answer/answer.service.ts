import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Answer, AnswerDocument } from './schemas/answer.schema'
import { Question, QuestionDocument } from '../question/schemas/question.schema'
import { CreateAnswerDto } from './dto/create-answer.dto'
import { QueryAnswerDto } from './dto/query-answer.dto'
import { QueryAnswerAdminDto } from './dto/query-answer-admin.dto'
import { BatchDeleteAnswerDto } from './dto/batch-delete-answer.dto'
import { MarkAnswerDto } from './dto/mark-answer.dto'

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer.name)
    private readonly answerModel: Model<AnswerDocument>,
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  /**
   * 提交答卷
   */
  async create(
    createDto: CreateAnswerDto,
    ip?: string,
    userAgent?: string,
  ) {
    const { questionId, answerList, duration } = createDto

    // 验证问卷ID格式
    if (!Types.ObjectId.isValid(questionId)) {
      throw new BadRequestException('无效的问卷ID')
    }

    // 查找问卷并验证是否存在且已发布
    const question = await this.questionModel.findById(questionId).exec()

    if (!question) {
      throw new NotFoundException('问卷不存在')
    }

    if (!question.isPublished) {
      throw new BadRequestException('问卷未发布，无法提交答卷')
    }

    // 创建答卷
    const answer = new this.answerModel({
      questionId: new Types.ObjectId(questionId),
      answerList,
      ip,
      userAgent,
      duration,
      isValid: true,
    })

    await answer.save()

    // 更新问卷的答卷数
    await this.questionModel.findByIdAndUpdate(questionId, {
      $inc: { answerCount: 1 },
    })

    return {
      message: '提交成功',
      _id: answer._id,
    }
  }

  /**
   * 获取问卷的答卷列表（需要问卷作者权限）
   */
  async findAll(username: string, query: QueryAnswerDto) {
    const { questionId, page = 1, pageSize = 10 } = query

    if (!questionId) {
      throw new BadRequestException('问卷ID不能为空')
    }

    // 验证问卷ID格式
    if (!Types.ObjectId.isValid(questionId)) {
      throw new BadRequestException('无效的问卷ID')
    }

    // 验证问卷所有权
    const question = await this.questionModel.findById(questionId).exec()

    if (!question) {
      throw new NotFoundException('问卷不存在')
    }

    if (question.author !== username) {
      throw new BadRequestException('无权查看此问卷的答卷')
    }

    // 查询答卷列表
    const [list, total] = await Promise.all([
      this.answerModel
        .find({ questionId: new Types.ObjectId(questionId) })
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean()
        .exec(),
      this.answerModel
        .countDocuments({ questionId: new Types.ObjectId(questionId) })
        .exec(),
    ])

    return {
      list,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    }
  }

  /**
   * 获取单个答卷详情
   */
  async findOne(id: string, username: string) {
    // 验证答卷ID格式
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的答卷ID')
    }

    const answer = await this.answerModel.findById(id).lean().exec()

    if (!answer) {
      throw new NotFoundException('答卷不存在')
    }

    // 验证权限
    const question = await this.questionModel
      .findById(answer.questionId)
      .exec()

    if (!question || question.author !== username) {
      throw new BadRequestException('无权查看此答卷')
    }

    return answer
  }

  /**
   * 删除答卷
   */
  async remove(id: string, username: string) {
    // 验证答卷ID格式
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的答卷ID')
    }

    const answer = await this.answerModel.findById(id).exec()

    if (!answer) {
      throw new NotFoundException('答卷不存在')
    }

    // 验证权限
    const question = await this.questionModel
      .findById(answer.questionId)
      .exec()

    if (!question || question.author !== username) {
      throw new BadRequestException('无权删除此答卷')
    }

    await this.answerModel.findByIdAndDelete(id).exec()

    // 更新问卷的答卷数
    await this.questionModel.findByIdAndUpdate(question._id, {
      $inc: { answerCount: -1 },
    })

    return {
      message: '删除成功',
    }
  }

  // ==================== 管理员功能 ====================

  /**
   * 获取所有答卷列表（管理员）
   */
  async findAllAdmin(query: QueryAnswerAdminDto) {
    const {
      questionId,
      keyword,
      page = 1,
      pageSize = 20,
      startDate,
      endDate,
      isValid,
      sortBy = 'createdAt',
    } = query

    const filter: any = {}

    // 按问卷ID筛选
    if (questionId && Types.ObjectId.isValid(questionId)) {
      filter.questionId = new Types.ObjectId(questionId)
    }

    // 按关键词搜索（IP或User-Agent）
    if (keyword) {
      filter.$or = [
        { ip: { $regex: keyword, $options: 'i' } },
        { userAgent: { $regex: keyword, $options: 'i' } },
      ]
    }

    // 按有效性筛选
    if (isValid !== undefined) {
      filter.isValid = isValid
    }

    // 按时间范围筛选
    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate)
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate)
      }
    }

    // 排序
    const sort: any = {}
    if (sortBy === 'duration') {
      sort.duration = -1
    } else {
      sort.createdAt = -1
    }

    // 查询答卷列表（带问卷标题）
    const [list, total] = await Promise.all([
      this.answerModel
        .find(filter)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean()
        .exec(),
      this.answerModel.countDocuments(filter).exec(),
    ])

    // 获取关联的问卷信息
    const questionIds = [...new Set(list.map((item) => item.questionId.toString()))]
    const questions = await this.questionModel
      .find({ _id: { $in: questionIds.map((id) => new Types.ObjectId(id)) } })
      .select('_id title author')
      .lean()
      .exec()

    const questionMap = new Map(
      questions.map((q) => [q._id.toString(), { title: q.title, author: q.author }])
    )

    // 合并数据
    const listWithQuestion = list.map((item) => ({
      ...item,
      questionTitle: questionMap.get(item.questionId.toString())?.title || '未知问卷',
      questionAuthor: questionMap.get(item.questionId.toString())?.author || '',
    }))

    return {
      list: listWithQuestion,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    }
  }

  /**
   * 标记答卷（管理员）
   */
  async markAnswer(id: string, markDto: MarkAnswerDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('无效的答卷ID')
    }

    const answer = await this.answerModel.findById(id).exec()

    if (!answer) {
      throw new NotFoundException('答卷不存在')
    }

    answer.isValid = markDto.isValid
    await answer.save()

    return {
      message: markDto.isValid ? '已标记为正常答卷' : '已标记为异常答卷',
    }
  }

  /**
   * 批量删除答卷（管理员）
   */
  async batchDeleteAnswers(batchDeleteDto: BatchDeleteAnswerDto) {
    const { ids } = batchDeleteDto

    // 验证所有ID格式
    const validIds = ids.filter((id) => Types.ObjectId.isValid(id))

    if (validIds.length === 0) {
      throw new BadRequestException('没有有效的答卷ID')
    }

    const objectIds = validIds.map((id) => new Types.ObjectId(id))

    // 获取答卷信息以更新问卷统计
    const answers = await this.answerModel
      .find({ _id: { $in: objectIds } })
      .select('questionId')
      .lean()
      .exec()

    // 统计每个问卷被删除的答卷数
    const questionCountMap = new Map<string, number>()
    answers.forEach((answer) => {
      const qid = answer.questionId.toString()
      questionCountMap.set(qid, (questionCountMap.get(qid) || 0) + 1)
    })

    // 删除答卷
    const result = await this.answerModel.deleteMany({ _id: { $in: objectIds } }).exec()

    // 更新问卷的答卷数
    const updatePromises = Array.from(questionCountMap.entries()).map(([qid, count]) =>
      this.questionModel.findByIdAndUpdate(qid, {
        $inc: { answerCount: -count },
      })
    )
    await Promise.all(updatePromises)

    return {
      message: '批量删除成功',
      deletedCount: result.deletedCount,
    }
  }

  /**
   * 获取答卷统计数据（管理员）
   */
  async getStatistics() {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
      total,
      todayCount,
      last7DaysCount,
      last30DaysCount,
      validCount,
      invalidCount,
      avgDuration,
      byQuestion,
      trendLast7Days,
    ] = await Promise.all([
      // 总答卷数
      this.answerModel.countDocuments(),

      // 今日新增
      this.answerModel.countDocuments({ createdAt: { $gte: todayStart } }),

      // 最近7天
      this.answerModel.countDocuments({ createdAt: { $gte: last7Days } }),

      // 最近30天
      this.answerModel.countDocuments({ createdAt: { $gte: last30Days } }),

      // 正常答卷数
      this.answerModel.countDocuments({ isValid: true }),

      // 异常答卷数
      this.answerModel.countDocuments({ isValid: false }),

      // 平均答题时长
      this.answerModel
        .aggregate([
          { $match: { duration: { $exists: true, $gt: 0 } } },
          { $group: { _id: null, avgDuration: { $avg: '$duration' } } },
        ])
        .exec(),

      // 按问卷统计（Top 10）
      this.answerModel
        .aggregate([
          { $group: { _id: '$questionId', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .exec(),

      // 最近7天趋势
      this.answerModel
        .aggregate([
          { $match: { createdAt: { $gte: last7Days } } },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .exec(),
    ])

    // 获取Top 10问卷的标题
    const topQuestionIds = byQuestion.map((item) => item._id)
    const topQuestions = await this.questionModel
      .find({ _id: { $in: topQuestionIds } })
      .select('_id title')
      .lean()
      .exec()

    const questionMap = new Map(topQuestions.map((q) => [q._id.toString(), q.title]))

    const byQuestionWithTitle = byQuestion.map((item) => ({
      questionId: item._id.toString(),
      questionTitle: questionMap.get(item._id.toString()) || '未知问卷',
      count: item.count,
    }))

    return {
      total,
      todayCount,
      last7DaysCount,
      last30DaysCount,
      validCount,
      invalidCount,
      avgDuration: avgDuration[0]?.avgDuration || 0,
      byQuestion: byQuestionWithTitle,
      trendLast7Days: trendLast7Days.map((item) => ({
        date: item._id,
        count: item.count,
      })),
    }
  }

  /**
   * 导出答卷数据（管理员）
   * 返回用于生成Excel的数据
   */
  async exportAnswers(query: QueryAnswerAdminDto) {
    const { questionId, startDate, endDate, isValid } = query

    const filter: any = {}

    if (questionId && Types.ObjectId.isValid(questionId)) {
      filter.questionId = new Types.ObjectId(questionId)
    }

    if (isValid !== undefined) {
      filter.isValid = isValid
    }

    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate)
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate)
      }
    }

    // 查询所有符合条件的答卷
    const answers = await this.answerModel.find(filter).sort({ createdAt: -1 }).lean().exec()

    // 获取关联的问卷信息
    const questionIds = [...new Set(answers.map((item) => item.questionId.toString()))]
    const questions = await this.questionModel
      .find({ _id: { $in: questionIds.map((id) => new Types.ObjectId(id)) } })
      .select('_id title componentList')
      .lean()
      .exec()

    const questionMap = new Map(
      questions.map((q) => [
        q._id.toString(),
        { title: q.title, componentList: q.componentList },
      ])
    )

    // 格式化导出数据
    const exportData = answers.map((answer) => {
      const question = questionMap.get(answer.questionId.toString())
      const answersObj: any = {}

      // 将答案列表转换为对象
      answer.answerList.forEach((item) => {
        const componentTitle =
          question?.componentList.find((c: any) => c.fe_id === item.componentId)?.title ||
          item.componentId

        // 格式化答案值
        let formattedValue = item.value
        if (Array.isArray(item.value)) {
          formattedValue = item.value.join(', ')
        } else if (typeof item.value === 'object') {
          formattedValue = JSON.stringify(item.value)
        }

        answersObj[componentTitle] = formattedValue
      })

      return {
        答卷ID: answer._id.toString(),
        问卷标题: question?.title || '未知',
        提交时间: answer.createdAt ? new Date(answer.createdAt).toLocaleString('zh-CN') : '-',
        答题时长: answer.duration ? `${answer.duration}秒` : '-',
        IP地址: answer.ip || '-',
        设备信息: answer.userAgent || '-',
        状态: answer.isValid ? '正常' : '异常',
        ...answersObj,
      }
    })

    return exportData
  }
}

