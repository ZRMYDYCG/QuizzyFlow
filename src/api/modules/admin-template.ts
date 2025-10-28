/**
 * 管理员 - 模板管理 API
 */
import instance from '../index'
import type { Template, TemplateListResponse } from '@/types/template'

// 管理员查询参数
export interface AdminTemplateListParams {
  page?: number
  pageSize?: number
  keyword?: string
  category?: string
  type?: string
  author?: string
  isOfficial?: boolean
  isFeatured?: boolean
  approvalStatus?: 'pending' | 'approved' | 'rejected'
  sortBy?: string
}

// 模板统计数据
export interface TemplateStatistics {
  total: number
  official: number
  userCreated: number
  featured: number
  pending: number
  approved: number
  rejected: number
  byCategory: Array<{
    _id: string
    count: number
    avgUseCount: number
  }>
  topTemplates: Array<{
    _id: string
    name: string
    useCount: number
    likeCount: number
    viewCount: number
    rating: number
    author: string
  }>
}

// 审核操作
export interface ApproveTemplateParams {
  action: 'approve' | 'reject'
  reason?: string
}

// 获取所有模板（管理员）
export async function getAdminTemplateList(
  params: AdminTemplateListParams = {}
): Promise<TemplateListResponse> {
  return instance.get('/api/template/admin/list', { params })
}

// 获取模板详情（使用公共接口）
export async function getAdminTemplateDetail(id: string): Promise<Template> {
  return instance.get(`/api/template/${id}`)
}

// 审核模板
export async function approveTemplate(
  id: string,
  params: ApproveTemplateParams
): Promise<Template> {
  return instance.post(`/api/template/admin/${id}/approve`, params)
}

// 设置官方模板
export async function setTemplateOfficial(
  id: string,
  isOfficial: boolean
): Promise<Template> {
  return instance.patch(`/api/template/admin/${id}/official`, { isOfficial })
}

// 设置精选模板
export async function setTemplateFeatured(
  id: string,
  isFeatured: boolean
): Promise<Template> {
  return instance.patch(`/api/template/admin/${id}/featured`, { isFeatured })
}

// 更新模板（管理员）
export async function updateTemplateAdmin(
  id: string,
  data: {
    isOfficial?: boolean
    isFeatured?: boolean
    isPublic?: boolean
    rating?: number
  }
): Promise<Template> {
  return instance.patch(`/api/template/admin/${id}`, data)
}

// 删除模板（单个）
export async function deleteTemplateAdmin(id: string): Promise<void> {
  return instance.delete(`/api/template/${id}`)
}

// 批量删除模板
export async function batchDeleteTemplates(ids: string[]): Promise<{
  message: string
  deletedCount: number
}> {
  return instance.delete('/api/template/admin/batch-delete', {
    data: { ids }
  })
}

// 批量设置精选
export async function batchSetFeatured(
  ids: string[],
  isFeatured: boolean
): Promise<{
  message: string
  modifiedCount: number
}> {
  return instance.patch('/api/template/admin/batch-featured', {
    ids,
    isFeatured
  })
}

// 获取模板统计数据
export async function getTemplateStatistics(): Promise<TemplateStatistics> {
  return instance.get('/api/template/admin/statistics')
}

