/**
 * 管理员 - 内容审核 API
 */
import instance from '../index'

// 审核记录
export interface ModerationRecord {
  _id: string
  contentType: 'question' | 'template' | 'comment'
  contentId: string
  contentTitle: string
  author: string
  status: 'pending' | 'approved' | 'rejected' | 'auto_approved'
  riskLevel: 'low' | 'medium' | 'high'
  detectedKeywords: string[]
  riskScore: number
  isAutoReviewed: boolean
  reviewedBy?: string
  reviewedAt?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

// 敏感词
export interface SensitiveWord {
  _id: string
  word: string
  severity: 'low' | 'medium' | 'high'
  category: 'political' | 'violence' | 'pornography' | 'fraud' | 'spam' | 'other'
  isActive: boolean
  description?: string
  addedBy?: string
  createdAt: string
  updatedAt: string
}

// 查询参数
export interface QueryModerationParams {
  page?: number
  pageSize?: number
  status?: 'pending' | 'approved' | 'rejected' | 'auto_approved' | 'all'
  contentType?: 'question' | 'template' | 'comment' | 'all'
  riskLevel?: 'low' | 'medium' | 'high' | 'all'
  keyword?: string
}

// 审核统计
export interface ModerationStatistics {
  total: number
  pending: number
  approved: number
  rejected: number
  autoApproved: number
  autoApprovalRate: string
  byRiskLevel: Array<{
    riskLevel: string
    count: number
  }>
  byContentType: Array<{
    contentType: string
    count: number
  }>
}

// 获取待审核队列
export async function getModerationQueue(params: QueryModerationParams = {}) {
  return instance.get('/api/moderation/queue', { params })
}

// 审核内容（通过/拒绝）
export async function reviewContent(
  id: string,
  action: 'approve' | 'reject',
  reason?: string
) {
  return instance.post(`/api/moderation/${id}/review`, { action, reason })
}

// 批量审核
export async function batchReviewContent(
  ids: string[],
  action: 'approve' | 'reject',
  reason?: string
) {
  return instance.post('/api/moderation/batch-review', { ids, action, reason })
}

// 获取审核统计
export async function getModerationStatistics(): Promise<ModerationStatistics> {
  return instance.get('/api/moderation/statistics')
}

// 获取敏感词列表
export async function getSensitiveWords(page = 1, pageSize = 50) {
  return instance.get('/api/moderation/sensitive-words', {
    params: { page, pageSize },
  })
}

// 添加敏感词
export async function addSensitiveWord(data: {
  word: string
  severity: 'low' | 'medium' | 'high'
  category: string
  description?: string
}) {
  return instance.post('/api/moderation/sensitive-words', data)
}

// 删除敏感词
export async function deleteSensitiveWord(id: string) {
  return instance.delete(`/api/moderation/sensitive-words/${id}`)
}

// 批量导入敏感词
export async function batchImportSensitiveWords(words: Array<{
  word: string
  severity: 'low' | 'medium' | 'high'
  category: string
  description?: string
}>) {
  return instance.post('/api/moderation/sensitive-words/batch-import', { words })
}

