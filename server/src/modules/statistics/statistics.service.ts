import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Answer, AnswerDocument, AnswerItem } from '../answer/schemas/answer.schema'
import { Question, QuestionDocument } from '../question/schemas/question.schema'

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Answer.name)
    private readonly answerModel: Model<AnswerDocument>,
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  /**
   * 获取问卷的答卷统计列表（表格格式）
   */
  async getAnswerList(
    questionId: string,
    username: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    // 验证问卷ID
    if (!Types.ObjectId.isValid(questionId)) {
      throw new BadRequestException('无效的问卷ID')
    }

    // 验证问卷所有权
    const question = await this.questionModel.findById(questionId).exec()
    if (!question) {
      throw new NotFoundException('问卷不存在')
    }
    if (question.author !== username) {
      throw new BadRequestException('无权查看此问卷的统计数据')
    }

    // 获取问卷的组件列表
    const componentList = question.componentList || []

    // 获取答卷列表
    const [answers, total] = await Promise.all([
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

    // 将答卷数据转换为表格格式
    const list = answers.map((answer) => {
      const row: any = {
        _id: answer._id,
      }

      // 遍历问卷的所有组件
      componentList.forEach((component: any) => {
        const { fe_id, type, props } = component

        // 在答卷中查找对应组件的答案
        const answerItem = answer.answerList.find(
          (item: AnswerItem) => item.componentId === fe_id
        )

        if (answerItem) {
          const { value } = answerItem

          // 根据组件类型格式化显示值
          row[fe_id] = this.formatAnswerValue(type, value, props)
        } else {
          row[fe_id] = ''
        }
      })

      return row
    })

    return {
      total,
      list,
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
    // 验证问卷ID
    if (!Types.ObjectId.isValid(questionId)) {
      throw new BadRequestException('无效的问卷ID')
    }

    // 验证问卷所有权
    const question = await this.questionModel.findById(questionId).exec()
    if (!question) {
      throw new NotFoundException('问卷不存在')
    }
    if (question.author !== username) {
      throw new BadRequestException('无权查看此问卷的统计数据')
    }

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
  private formatAnswerValue(type: string, value: any, props: any): any {
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
        // 矩阵组件，返回对象格式 - 前端会特殊处理
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
        // 签名组件，返回 base64 数据 - 前端会渲染为图片
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
        // 其他类型直接返回字符串
        if (typeof value === 'object') {
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

