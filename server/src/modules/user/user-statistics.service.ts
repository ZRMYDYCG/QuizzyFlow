import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Question, QuestionDocument } from '../question/schemas/question.schema'
import { Answer, AnswerDocument } from '../answer/schemas/answer.schema'
import {
  UserStatisticsDto,
  QuestionStatsDto,
  TrendDataItem,
  ComponentTypeStats,
  ActivityHeatmapItem,
} from './dto/user-statistics.dto'

@Injectable()
export class UserStatisticsService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
    @InjectModel(Answer.name)
    private readonly answerModel: Model<AnswerDocument>,
  ) {}

  /**
   * 获取用户统计数据
   */
  async getUserStatistics(username: string): Promise<UserStatisticsDto> {
    // 1. 问卷基本统计
    const questionStats = await this.getQuestionStats(username)

    // 2. 最近7天创建趋势
    const last7DaysTrend = await this.getCreationTrend(username, 7)

    // 3. 最近30天创建趋势
    const last30DaysTrend = await this.getCreationTrend(username, 30)

    // 4. 组件类型使用统计
    const componentTypeStats = await this.getComponentTypeStats(username)

    // 5. 活跃度热力图（最近一年）
    const activityHeatmap = await this.getActivityHeatmap(username)

    return {
      questionStats,
      last7DaysTrend,
      last30DaysTrend,
      componentTypeStats,
      activityHeatmap,
    }
  }

  /**
   * 获取问卷基本统计
   */
  private async getQuestionStats(username: string): Promise<QuestionStatsDto> {
    const [stats] = await this.questionModel.aggregate([
      { $match: { author: username } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          published: {
            $sum: {
              $cond: [{ $eq: ['$isPublished', true] }, 1, 0],
            },
          },
          starred: {
            $sum: {
              $cond: [{ $eq: ['$isStar', true] }, 1, 0],
            },
          },
          deleted: {
            $sum: {
              $cond: [{ $eq: ['$isDeleted', true] }, 1, 0],
            },
          },
        },
      },
    ])

    // 获取总回答数
    const totalAnswers = await this.answerModel.countDocuments({
      username,
    })

    return {
      total: stats?.total || 0,
      published: stats?.published || 0,
      starred: stats?.starred || 0,
      deleted: stats?.deleted || 0,
      totalAnswers,
    }
  }

  /**
   * 获取创建趋势
   */
  private async getCreationTrend(
    username: string,
    days: number,
  ): Promise<TrendDataItem[]> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    const trendData = await this.questionModel.aggregate([
      {
        $match: {
          author: username,
          isDeleted: false,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
        },
      },
    ])

    // 填充缺失的日期（确保每一天都有数据）
    const result: TrendDataItem[] = []
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]

      const found = trendData.find((item) => item.date === dateStr)
      result.push({
        date: dateStr,
        count: found ? found.count : 0,
      })
    }

    return result
  }

  /**
   * 获取组件类型使用统计（Top 10）
   */
  private async getComponentTypeStats(
    username: string,
  ): Promise<ComponentTypeStats[]> {
    const questions = await this.questionModel
      .find({
        author: username,
        isDeleted: false,
      })
      .select('componentList')
      .lean()
      .exec()

    // 统计每种组件类型的使用次数
    const typeCount: Record<string, number> = {}

    questions.forEach((question) => {
      if (question.componentList && Array.isArray(question.componentList)) {
        question.componentList.forEach((component: any) => {
          const type = component.type || 'Unknown'
          typeCount[type] = (typeCount[type] || 0) + 1
        })
      }
    })

    // 转换为数组并排序
    const result: ComponentTypeStats[] = Object.entries(typeCount)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // 只取前10个

    return result
  }

  /**
   * 获取活跃度热力图（最近一年）
   */
  private async getActivityHeatmap(
    username: string,
  ): Promise<ActivityHeatmapItem[]> {
    const startDate = new Date()
    startDate.setFullYear(startDate.getFullYear() - 1)
    startDate.setHours(0, 0, 0, 0)

    // 统计创建日期
    const creationActivity = await this.questionModel.aggregate([
      {
        $match: {
          author: username,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
        },
      },
    ])

    // 统计更新日期
    const updateActivity = await this.questionModel.aggregate([
      {
        $match: {
          author: username,
          updatedAt: { $gte: startDate },
          // 排除创建时间等于更新时间的（即只统计真正的编辑操作）
          $expr: { $ne: ['$createdAt', '$updatedAt'] },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
        },
      },
    ])

    // 合并创建和更新活动
    const activityMap: Record<string, number> = {}

    creationActivity.forEach((item) => {
      activityMap[item.date] = (activityMap[item.date] || 0) + item.count
    })

    updateActivity.forEach((item) => {
      activityMap[item.date] = (activityMap[item.date] || 0) + item.count
    })

    // 转换为数组
    const result: ActivityHeatmapItem[] = Object.entries(activityMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return result
  }
}

