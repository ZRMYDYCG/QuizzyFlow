import { ApiProperty } from '@nestjs/swagger'

/**
 * 问卷统计数据
 */
export class QuestionStatsDto {
  @ApiProperty({ description: '总问卷数' })
  total: number

  @ApiProperty({ description: '已发布问卷数' })
  published: number

  @ApiProperty({ description: '收藏问卷数' })
  starred: number

  @ApiProperty({ description: '回收站问卷数' })
  deleted: number

  @ApiProperty({ description: '总回答数' })
  totalAnswers: number
}

/**
 * 创建趋势数据项
 */
export class TrendDataItem {
  @ApiProperty({ description: '日期', example: '2024-01-01' })
  date: string

  @ApiProperty({ description: '数量' })
  count: number
}

/**
 * 组件类型统计项
 */
export class ComponentTypeStats {
  @ApiProperty({ description: '组件类型', example: 'QuestionInput' })
  type: string

  @ApiProperty({ description: '使用次数' })
  count: number
}

/**
 * 活跃度热力图数据项
 */
export class ActivityHeatmapItem {
  @ApiProperty({ description: '日期', example: '2024-01-01' })
  date: string

  @ApiProperty({ description: '活跃度（创建/编辑次数）' })
  count: number
}

/**
 * 用户统计数据响应 DTO
 */
export class UserStatisticsDto {
  @ApiProperty({ description: '问卷统计', type: QuestionStatsDto })
  questionStats: QuestionStatsDto

  @ApiProperty({
    description: '最近7天创建趋势',
    type: [TrendDataItem],
  })
  last7DaysTrend: TrendDataItem[]

  @ApiProperty({
    description: '最近30天创建趋势',
    type: [TrendDataItem],
  })
  last30DaysTrend: TrendDataItem[]

  @ApiProperty({
    description: '组件类型使用统计（Top 10）',
    type: [ComponentTypeStats],
  })
  componentTypeStats: ComponentTypeStats[]

  @ApiProperty({
    description: '活跃度热力图（最近一年）',
    type: [ActivityHeatmapItem],
  })
  activityHeatmap: ActivityHeatmapItem[]
}

