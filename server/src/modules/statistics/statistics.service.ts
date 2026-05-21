import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Answer, AnswerDocument, AnswerItem } from '../answer/schemas/answer.schema'
import { Question, QuestionDocument } from '../question/schemas/question.schema'

/** 表格元数据列（与前端约定，勿与组件 fe_id 冲突） */
export const STATS_META = {
  submittedAt: '__submittedAt',
  respondentName: '__respondentName',
  duration: '__duration',
  isAnonymous: '__isAnonymous',
} as const

const EXPORT_MAX_ROWS = 10000

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Answer.name)
    private readonly answerModel: Model<AnswerDocument>,
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  private async assertQuestionOwner(questionId: string, username: string) {
    if (!Types.ObjectId.isValid(questionId)) {
      throw new BadRequestException('无效的问卷ID')
    }

    const question = await this.questionModel.findById(questionId).exec()
    if (!question) {
      throw new NotFoundException('问卷不存在')
    }
    if (question.author !== username) {
      throw new BadRequestException('无权查看此问卷的统计数据')
    }

    return question
  }

  private mapAnswerToRow(
    answer: any,
    componentList: any[],
    forExport = false,
  ): Record<string, any> {
    const row: Record<string, any> = {
      _id: answer._id,
      [STATS_META.submittedAt]: answer.createdAt
        ? new Date(answer.createdAt).toISOString()
        : '',
      [STATS_META.respondentName]:
        answer.respondentName ||
        (answer.isAnonymous ? '匿名用户' : '未填写'),
      [STATS_META.duration]:
        answer.duration != null ? `${answer.duration} 秒` : '',
      [STATS_META.isAnonymous]: answer.isAnonymous ? '是' : '否',
    }

    componentList.forEach((component: any) => {
      const { fe_id, type, props } = component
      const answerItem = answer.answerList?.find(
        (item: AnswerItem) => item.componentId === fe_id,
      )

      if (answerItem) {
        row[fe_id] = this.formatAnswerValue(
          type,
          answerItem.value,
          props,
          forExport,
        )
      } else {
        row[fe_id] = ''
      }
    })

    return row
  }

  /**
   * 获取问卷的答卷统计列表（表格格式）
   */
  async getAnswerList(
    questionId: string,
    username: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const question = await this.assertQuestionOwner(questionId, username)
    const componentList = question.componentList || []
    const qid = new Types.ObjectId(questionId)

    const [answers, total] = await Promise.all([
      this.answerModel
        .find({ questionId: qid })
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean()
        .exec(),
      this.answerModel.countDocuments({ questionId: qid }).exec(),
    ])

    const list = answers.map((answer) =>
      this.mapAnswerToRow(answer, componentList),
    )

    return { total, list }
  }

  /**
   * 全量导出答卷（表格行，最多 EXPORT_MAX_ROWS 条）
   */
  async exportAnswerList(questionId: string, username: string) {
    const question = await this.assertQuestionOwner(questionId, username)
    const componentList = question.componentList || []
    const qid = new Types.ObjectId(questionId)

    const total = await this.answerModel.countDocuments({ questionId: qid }).exec()

    if (total > EXPORT_MAX_ROWS) {
      throw new BadRequestException(
        `答卷数量超过 ${EXPORT_MAX_ROWS} 条，请联系管理员分批导出`,
      )
    }

    const answers = await this.answerModel
      .find({ questionId: qid })
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    const list = answers.map((answer) =>
      this.mapAnswerToRow(answer, componentList, true),
    )

    return { total, list }
  }

  /**
   * 问卷答卷概览统计
   */
  async getOverview(questionId: string, username: string) {
    await this.assertQuestionOwner(questionId, username)
    const qid = new Types.ObjectId(questionId)

    const [total, agg] = await Promise.all([
      this.answerModel.countDocuments({ questionId: qid }).exec(),
      this.answerModel
        .aggregate([
          { $match: { questionId: qid } },
          {
            $group: {
              _id: null,
              avgDuration: { $avg: '$duration' },
              anonymousCount: {
                $sum: { $cond: [{ $eq: ['$isAnonymous', true] }, 1, 0] },
              },
              lastSubmittedAt: { $max: '$createdAt' },
              firstSubmittedAt: { $min: '$createdAt' },
            },
          },
        ])
        .exec(),
    ])

    const summary = agg[0] || {}
    const anonymousCount = summary.anonymousCount || 0

    return {
      total,
      avgDurationSeconds:
        summary.avgDuration != null
          ? Math.round(summary.avgDuration)
          : null,
      anonymousCount,
      namedCount: total - anonymousCount,
      lastSubmittedAt: summary.lastSubmittedAt || null,
      firstSubmittedAt: summary.firstSubmittedAt || null,
    }
  }

  /**
   * 获取单个组件的统计数据（用于图表）
   */
  async getComponentStatistics(
    questionId: string,
    componentId: string,
    username: string,
  ) {
    const question = await this.assertQuestionOwner(questionId, username)

    // 查找组件配置
    const component = question.componentList.find(
      (c: any) => c.fe_id === componentId
    )
    if (!component) {
      throw new NotFoundException('组件不存在')
    }

    // 获取所有答卷
    const answers = await this.answerModel
      .find({ questionId: new Types.ObjectId(questionId) })
      .lean()
      .exec()

    // 统计答案
    const stat = this.calculateComponentStatistics(
      component.type,
      component.props,
      answers,
      componentId,
    )

    return { stat }
  }

  /**
   * 格式化答案值用于表格显示
   */
  private formatAnswerValue(
    type: string,
    value: any,
    props: any,
    forExport = false,
  ): any {
    if (value === null || value === undefined || value === '') {
      return ''
    }

    switch (type) {
      // ========== 基础表单组件 ==========
      case 'question-input':
      case 'question-textarea':
        return String(value)

      case 'question-checkbox':
        // checkbox 的值是数组，需要转换为文本
        if (Array.isArray(value)) {
          if (value.length === 0) {
            return ''
          }
          // 将选中的值转换为对应的文本
          const list = props?.list || []
          const texts = value
            .map((val: string) => {
              const option = list.find((opt: any) => opt.value === val)
              return option ? option.text : val
            })
            .filter(Boolean)
          return texts.join(', ')
        }
        return String(value)

      case 'question-radio':
        // radio 的值是单个选项的 value，转换为对应的 text
        const options = props?.options || []
        const option = options.find((opt: any) => opt.value === value)
        return option ? option.text : String(value)

      case 'question-select':
        // select 的值也需要转换（支持 text 和 label 两种字段）
        const selectOptions = props?.options || []
        if (Array.isArray(value)) {
          // 多选模式
          const texts = value
            .map((val: string) => {
              const option = selectOptions.find((opt: any) => opt.value === val)
              return option ? (option.text || option.label) : val
            })
            .filter(Boolean)
          return texts.join(', ')
        } else {
          // 单选模式
          const selectedOption = selectOptions.find((opt: any) => opt.value === value)
          return selectedOption ? (selectedOption.text || selectedOption.label) : String(value)
        }

      case 'question-rate':
      case 'question-star-rating':
        // 评分组件，返回分数
        return `${value} 分`

      case 'question-slider':
        // 滑块组件
        if (Array.isArray(value)) {
          return value.join(' ~ ')
        }
        return String(value)

      case 'question-date':
        // 日期组件，返回日期字符串
        if (Array.isArray(value)) {
          return value.filter(Boolean).join(' 至 ')
        }
        return String(value)

      case 'question-upload':
        // 文件上传组件，返回文件数量
        if (Array.isArray(value)) {
          return `${value.length} 个文件`
        }
        return '1 个文件'

      // ========== 高级选择组件 ==========
      case 'question-cascader':
        // 级联选择器，返回路径
        if (Array.isArray(value)) {
          return value.join(' / ')
        }
        return String(value)

      case 'question-autocomplete':
        return String(value)

      case 'question-transfer':
        // 穿梭框，返回选中项数量
        if (Array.isArray(value)) {
          return `已选 ${value.length} 项`
        }
        return ''

      // ========== 高级交互组件 ==========
      case 'question-ranking':
        // 排序组件，返回排序后的文本
        if (Array.isArray(value)) {
          const texts = value.map((item: any, index: number) => 
            `${index + 1}. ${item.text || item.value}`
          )
          return texts.join('; ')
        }
        return String(value)

      case 'question-matrix':
        if (forExport && typeof value === 'object' && value !== null) {
          return Object.entries(value)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join('; ')
        }
        return value

      case 'question-nps':
        // NPS 净推荐值，返回分数
        return `${value} 分`

      case 'question-image-choice':
        // 图片选择，返回选择的标签
        if (Array.isArray(value)) {
          return value.join(', ')
        }
        return String(value)

      case 'question-signature':
        if (forExport) {
          return typeof value === 'string' && value.startsWith('data:image')
            ? '[已签名]'
            : ''
        }
        return value

      case 'question-color-picker':
        // 颜色选择器，返回颜色值 - 前端会显示色块
        return value

      case 'question-emoji-picker':
        // Emoji 选择器，返回 emoji 或数组
        if (Array.isArray(value)) {
          return value.join(' ')
        }
        return String(value)

      default:
        if (typeof value === 'object') {
          if (forExport) {
            return JSON.stringify(value)
          }
          return JSON.stringify(value)
        }
        return String(value)
    }
  }

  /**
   * 计算组件的统计数据（用于图表）
   */
  private calculateComponentStatistics(
    type: string,
    props: any,
    answers: any[],
    componentId: string,
  ): any[] {
    const stat: Record<string, number> = {}

    // 提取所有答案值
    answers.forEach((answer) => {
      const answerItem = answer.answerList.find(
        (item: AnswerItem) => item.componentId === componentId
      )
      
      if (answerItem) {
        const { value } = answerItem

        if (type === 'question-checkbox') {
          // checkbox 是数组
          if (Array.isArray(value)) {
            value.forEach((val: string) => {
              stat[val] = (stat[val] || 0) + 1
            })
          }
        } else if (type === 'question-radio' || type === 'question-select') {
          // radio 和 select 是单选
          if (value !== null && value !== undefined && value !== '') {
            stat[value] = (stat[value] || 0) + 1
          }
        }
      }
    })

    // 转换为图表所需的格式
    const result: any[] = []

    if (type === 'question-checkbox') {
      const list = props?.list || []
      list.forEach((option: any) => {
        result.push({
          name: option.text,
          count: stat[option.value] || 0,
        })
      })
    } else if (type === 'question-radio' || type === 'question-select') {
      const options = props?.options || []
      options.forEach((option: any) => {
        result.push({
          name: option.text || option.label || option.value,
          count: stat[option.value] || 0,
        })
      })
    }

    return result
  }
}

