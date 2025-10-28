/**
 * 管理员 - 反馈管理 API
 */
import instance from '../index'

// 反馈类型
export interface Feedback {
  _id: string
  type: 'bug' | 'feature' | 'improvement' | 'other'
  title: string
  description: string
  author: string
  authorEmail?: string
  status: 'pending' | 'in_progress' | 'resolved' | 'closed' | 'rejected'
  priority?: 'low' | 'medium' | 'high' | 'critical'
  assignedTo?: string
  votes: number
  voters: string[]
  tags: string[]
  screenshots: string[]
  browserInfo?: string
  osInfo?: string
  replies: Array<{
    content: string
    author: string
    createdAt: string
  }>
  resolvedAt?: string
  resolvedBy?: string
  createdAt: string
  updatedAt: string
}

// 查询参数
export interface QueryFeedbackParams {
  page?: number
  pageSize?: number
  type?: 'bug' | 'feature' | 'improvement' | 'other' | 'all'
  status?: 'pending' | 'in_progress' | 'resolved' | 'closed' | 'rejected' | 'all'
  priority?: 'low' | 'medium' | 'high' | 'critical' | 'all'
  keyword?: string
  sortBy?: 'votes' | 'createdAt'
}

// 反馈统计
export interface FeedbackStatistics {
  total: number
  byType: Array<{
    type: string
    count: number
  }>
  byStatus: Array<{
    status: string
    count: number
  }>
  byPriority: Array<{
    priority: string
    count: number
  }>
  topVoted: Array<{
    _id: string
    title: string
    votes: number
    status: string
  }>
  recentResolved: Array<{
    _id: string
    title: string
    type: string
    resolvedAt: string
    resolvedBy: string
  }>
}

// 创建反馈
export async function createFeedback(data: {
  type: 'bug' | 'feature' | 'improvement' | 'other'
  title: string
  description: string
  authorEmail?: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  tags?: string[]
  screenshots?: string[]
  browserInfo?: string
  osInfo?: string
}) {
  return instance.post('/api/feedback', data)
}

// 获取反馈列表（管理员）
export async function getAdminFeedbackList(params: QueryFeedbackParams = {}) {
  return instance.get('/api/feedback/admin/list', { params })
}

// 获取反馈详情
export async function getFeedbackDetail(id: string): Promise<Feedback> {
  return instance.get(`/api/feedback/${id}`)
}

// 更新反馈（管理员）
export async function updateFeedback(
  id: string,
  data: {
    status?: 'pending' | 'in_progress' | 'resolved' | 'closed' | 'rejected'
    priority?: 'low' | 'medium' | 'high' | 'critical'
    assignedTo?: string
  }
) {
  return instance.patch(`/api/feedback/admin/${id}`, data)
}

// 回复反馈
export async function replyFeedback(id: string, content: string) {
  return instance.post(`/api/feedback/${id}/reply`, { content })
}

// 投票
export async function voteFeedback(id: string) {
  return instance.post(`/api/feedback/${id}/vote`)
}

// 取消投票
export async function unvoteFeedback(id: string) {
  return instance.post(`/api/feedback/${id}/unvote`)
}

// 删除反馈（管理员）
export async function deleteFeedback(id: string) {
  return instance.delete(`/api/feedback/admin/${id}`)
}

// 获取反馈统计
export async function getFeedbackStatistics(): Promise<FeedbackStatistics> {
  return instance.get('/api/feedback/admin/statistics')
}

