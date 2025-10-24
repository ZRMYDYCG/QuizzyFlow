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
}

