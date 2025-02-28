import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Answer } from './schemas/answer.schema'

@Injectable()
export class AnswerService {
  constructor(@InjectModel(Answer.name) private readonly answerModel) {}
  // 创建答卷
  async create(answerInfo) {
    if (answerInfo.questionId === null) {
      throw new HttpException('缺少问卷 id', HttpStatus.BAD_REQUEST)
    }

    const answer = new this.answerModel(answerInfo)
    return await answer.save()
  }
  // 获取某问卷的答卷的数量
  async count(questionId: string) {
    if (!questionId) return 0
    return await this.answerModel.count({ questionId })
  }
  // 获取某问卷的所有答卷列表
  async findAll(questionId: string, opt: { page: number; pageSize: number }) {
    if (!questionId) return []

    const { page = 1, pageSize = 10 } = opt
    return await this.answerModel
      .find({
        questionId,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createAt: -1 })
  }
}
