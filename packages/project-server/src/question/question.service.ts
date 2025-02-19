import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Question } from './schemas/question.schema'

@Injectable()
export class QuestionService {
  constructor(
    // 注入 Question 模型
    @InjectModel(Question.name) private readonly questionModel
  ) {}
  async create() {
    const question = new this.questionModel({
      title: 'title',
      desc: 'desc',
    })
    return await question.save()
  }
  async findOne(id: string) {
    return await this.questionModel.findById(id)
  }
  async delete(id: string) {
    return await this.questionModel.findByIdAndRemove(id)
  }
  async update(id: string, data) {
    return await this.questionModel.findByIdAndUpdate({ _id: id }, data)
  }
  async findAllList({ keyword = '', page = 1, pageSize = 10 }) {
    const options: any = {}
    if (keyword) {
      const reg = new RegExp(keyword, 'i')
      options.title = { $regex: reg } // 模糊搜索标题
    }

    return await this.questionModel
      .find(options)
      .sort({ id: -1 }) // 倒序排列
      // 分页: 跳过前面多少条, 取多少条
      .skip((page - 1) * pageSize) // 跳过前面多少条
      .limit(pageSize) // 限制返回多少条
  }

  async count({ keyword = '' }) {
    const options: any = {}
    if (keyword) {
      const reg = new RegExp(keyword, 'i')
      options.title = { $regex: reg } // 模糊搜索标题
    }

    return await this.questionModel.countDocuments(options)
  }
}
