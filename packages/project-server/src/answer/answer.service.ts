import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Answer } from './schemas/answer.schema'
import { HttpException, HttpStatus } from '@nestjs/common'

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
}
