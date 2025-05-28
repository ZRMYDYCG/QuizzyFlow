import { Injectable } from '@nestjs/common'
import { QuestionService } from '../question/question.service'
import { AnswerService } from '../answer/answer.service'

@Injectable()
export class StatService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService
  ) {}
  private _getRadioOptText(value, props: any = {}) {
    const { options = [] } = props
    const length = options.length

    for (let i = 0; i < length; i++) {
      const item = options[i]
      if (item.value === value) {
        return item.text
      }
    }

    return ''
  }

  private _getCheckboxOpText(value, props: any = {}) {
    const { list = [] } = props
    const length = list.length

    for (let i = 0; i < length; i++) {
      const item = list[i]
      if (item.value === value) {
        return item.text
      }
    }
    return ''
  }

  private _getAnswersInfo(question, answerList = []) {
    const res = {}

    const { componentList = [] } = question

    answerList.forEach((a) => {
      const { componentFeId, value = [] } = a
      // 获取组件信息
      const comp = componentList.filter((c) => c.fe_id === componentFeId)[0]
      const { type, props = {} } = comp

      if (type === 'question-radio') {
        // 单选
        res[componentFeId] = value
          .map((v) => this._getRadioOptText(v, props))
          .toString()
      } else if (type === 'question-checkbox') {
        // 多选
        res[componentFeId] = value
          .map((v) => this._getCheckboxOpText(v, props))
          .toString()
      } else {
        // 其他
        res[componentFeId] = value.toString()
      }
    })
    return res
  }

  // 获取单个问卷的答卷列表（分页）和数量
  async getQuestionStatListAndCount(
    questionId: string,
    opt: {
      page: number
      pageSize: number
    }
  ) {
    const noData = { list: [], count: 0 }
    if (!questionId) return noData

    const q = await this.questionService.findOne(questionId)

    if (!q) return noData

    const total = await this.answerService.count(questionId)

    if (total === 0) return noData

    const answers = await this.answerService.findAll(questionId, opt)

    const list = answers.map((answer) => {
      return {
        _id: answer._id,
        ...this._getAnswersInfo(q, answer.answerList),
      }
    })

    return {
      list,
      total,
    }
  }

  // 获取单个组件的统计数据
  async getComponentStat(questionId: string, componentFeId: string) {
    if (!questionId || !componentFeId) return []

    // 获取问卷
    const q = await this.questionService.findOne(questionId) // 问卷
    if (q === null) return []

    // 获取组件
    const { componentList = [] } = q
    const comp = componentList.filter((c) => c.fe_id === componentFeId)[0]
    if (comp === null) return []

    const { type, props } = comp

    if (type !== 'question-radio' && type === 'question-checkbox') {
      // 单组件的, 只统计单选和多选, 其它不统计
      return []
    }
    // 获取答卷列表
    const total = await this.answerService.count(questionId)
    if (total === 0) return []
    const answers = await this.answerService.findAll(questionId, {
      page: 1,
      pageSize: total, // 获取所有, 不进行分页
    })

    // 累加各个 value 的数量
    const countInfo = {}
    answers.forEach((a) => {
      const { answerList = [] } = a
      answerList.forEach((a) => {
        if (a.componentFeId !== componentFeId) return
        a.value.forEach((v) => {
          if (countInfo[v] === null) countInfo[v] = 0
          countInfo[v]++ // 累加
        })
      })
    })

    // 整理数据
    const list = []
    for (const val in countInfo) {
      let text = ''
      if (type === 'question-radio') {
        text = this._getRadioOptText(val, props)
      }
      if (type === 'question-checkbox') {
        text = this._getCheckboxOpText(val, props)
      }

      list.push({
        name: text,
        count: countInfo[val],
      })
    }

    return list
  }
}
