/**
 * 模板市场 API
 */
import instance from '../index'
import type {
  Template,
  TemplateListParams,
  TemplateListResponse,
  CreateTemplateRequest,
} from '@/types/template'

// 获取模板列表
export async function getTemplateList(params: TemplateListParams = {}): Promise<TemplateListResponse> {
  return instance.get('/api/template', { params })
}

// 获取模板详情
export async function getTemplateDetail(id: string): Promise<Template> {
  return instance.get(`/api/template/${id}`)
}

// 创建模板
export async function createTemplate(data: CreateTemplateRequest): Promise<Template> {
  return instance.post('/api/template', data)
}

// 更新模板
export async function updateTemplate(id: string, data: Partial<CreateTemplateRequest>): Promise<Template> {
  return instance.patch(`/api/template/${id}`, data)
}

// 删除模板
export async function deleteTemplate(id: string): Promise<void> {
  return instance.delete(`/api/template/${id}`)
}

// 使用模板（记录使用次数）
export async function useTemplate(id: string): Promise<void> {
  return instance.post(`/api/template/${id}/use`)
}

// 点赞模板
export async function likeTemplate(id: string): Promise<void> {
  return instance.post(`/api/template/${id}/like`)
}

// 取消点赞
export async function unlikeTemplate(id: string): Promise<void> {
  return instance.delete(`/api/template/${id}/like`)
}

// 获取我的模板列表
export async function getMyTemplates(params: TemplateListParams = {}): Promise<TemplateListResponse> {
  return instance.get('/api/template/my', { params })
}

// 从模板创建问卷
export async function createQuestionFromTemplate(templateId: string): Promise<{ _id: string }> {
  return instance.post(`/api/question/from-template/${templateId}`)
}

// 获取热门模板（首页推荐）
export async function getFeaturedTemplates(limit: number = 6): Promise<Template[]> {
  return instance.get('/api/template/featured', { params: { limit } })
}

// 获取最新模板
export async function getLatestTemplates(limit: number = 6): Promise<Template[]> {
  return instance.get('/api/template/latest', { params: { limit } })
}

