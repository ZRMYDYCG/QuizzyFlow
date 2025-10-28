/**
 * 管理员 - 答卷管理 API
 */
import instance from '../index'

// 答卷列表查询参数
export interface AdminAnswerListParams {
  page?: number
  pageSize?: number
  questionId?: string
  keyword?: string
  startDate?: string
  endDate?: string
  isValid?: boolean
  sortBy?: string
}

// 答卷项
export interface AnswerItem {
  componentId: string
  componentType: string
  value: any
}

// 答卷
export interface Answer {
  _id: string
  questionId: string
  answerList: AnswerItem[]
  ip?: string
  userAgent?: string
  duration?: number
  isValid: boolean
  createdAt: string
  updatedAt: string
  questionTitle?: string
  questionAuthor?: string
}

// 答卷列表响应
export interface AnswerListResponse {
  list: Answer[]
  total: number
  page: number
  pageSize: number
}

// 答卷统计
export interface AnswerStatistics {
  total: number
  todayCount: number
  last7DaysCount: number
  last30DaysCount: number
  validCount: number
  invalidCount: number
  avgDuration: number
  byQuestion: Array<{
    questionId: string
    questionTitle: string
    count: number
  }>
  trendLast7Days: Array<{
    date: string
    count: number
  }>
}

// 获取答卷列表（管理员）
export async function getAdminAnswerList(
  params: AdminAnswerListParams = {}
): Promise<AnswerListResponse> {
  return instance.get('/api/answer/admin/list', { params })
}

// 获取答卷详情
export async function getAnswerDetail(id: string): Promise<Answer> {
  return instance.get(`/api/answer/${id}`)
}

// 标记答卷
export async function markAnswer(
  id: string,
  isValid: boolean
): Promise<{ message: string }> {
  return instance.patch(`/api/answer/admin/${id}/mark`, { isValid })
}

// 批量删除答卷
export async function batchDeleteAnswers(ids: string[]): Promise<{
  message: string
  deletedCount: number
}> {
  return instance.delete('/api/answer/admin/batch-delete', {
    data: { ids }
  })
}

// 删除单个答卷
export async function deleteAnswer(id: string): Promise<{ message: string }> {
  return instance.delete(`/api/answer/${id}`)
}

// 获取答卷统计
export async function getAnswerStatistics(): Promise<AnswerStatistics> {
  return instance.get('/api/answer/admin/statistics')
}

// 导出答卷数据
export async function exportAnswers(
  params: AdminAnswerListParams = {}
): Promise<any[]> {
  return instance.get('/api/answer/admin/export', { params })
}

