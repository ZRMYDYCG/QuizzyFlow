import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Question } from './schemas/question.schema'
import mongoose from 'mongoose'
import { nanoid } from 'nanoid'

@Injectable()
export class QuestionService {
  constructor(
    // 注入 Question 模型
    @InjectModel(Question.name) private readonly questionModel
  ) {}
  async create(username: string) {
    const question = new this.questionModel({
      title: '问卷标题' + Date.now(),
      desc: '问卷描述',
      author: username,
      componentList: [
        {
          fe_id: nanoid(),
          type: 'question-info',
          title: '问卷信息',
          props: {
            title: '问卷标题',
            desc: '问卷描述...',
          },
        },
      ],
    })
    return await question.save()
  }
  async findOne(id: string) {
    return await this.questionModel.findById(id)
  }
  async delete(id: string, author: string) {
    return await this.questionModel.findOneAndDelete({
      _id: id,
      author,
    })
  }
  async deleteMany(ids: string[], author: string) {
    return await this.questionModel.deleteMany({
      _id: { $in: ids },
      author,
    })
  }
  async update(id: string, author: string, data) {
    return await this.questionModel.findByIdAndUpdate({ _id: id, author }, data)
  }
  async findAllList({
    keyword = '',
    page = 1,
    pageSize = 10,
    isDeleted,
    isStar,
    author = '',
  }) {
    const options: any = {
      author,
      isDeleted,
      isStar,
    }

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

  async count({ keyword = '', isDeleted = false, isStar, author = '' }) {
    const options: any = {
      author,
      isDeleted,
      isStar,
    }
    if (keyword) {
      const reg = new RegExp(keyword, 'i')
      options.title = { $regex: reg } // 模糊搜索标题
    }

    return await this.questionModel.countDocuments(options)
  }

  async duplicate(id: string, author: string) {
    const question = await this.questionModel.findById(id)
    const newQuestion = new this.questionModel({
      ...question.toObject(),
      _id: new mongoose.Types.ObjectId(),
      title: question.title + '副本',
      author,
      isPublish: false,
      isStar: false,
      componentList: question.componentList.map((component: any) => ({
        ...component,
        fe_id: nanoid(),
      })),
    })
    return newQuestion.save()
  }
}
