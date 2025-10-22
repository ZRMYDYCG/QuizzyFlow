import instance from '../index.ts'
import type { ResDataType } from '../index.ts'

/**
 * 查询选项接口
 */
interface SearchOption {
  keyword?: string
  isStar?: boolean
  isDeleted?: boolean
  page?: number
  pageSize?: number
}

/**
 * 问卷列表响应接口
 */
interface QuestionListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}

/**
 * 统计信息接口
 */
interface StatisticsResponse {
  total: number
  published: number
  starred: number
  deleted: number
  normal: number
}

/**
 * 获取单个问卷
 * GET /api/question/:id
 */
export async function getQuestion(id: string): Promise<ResDataType> {
  return await instance.get(`/api/question/${id}`)
}

/**
 * 创建新问卷
 * POST /api/question
 */
export async function createQuestion(
  data?: Partial<any>
): Promise<ResDataType> {
  return await instance.post(`/api/question`, data || {})
}

/**
 * 获取问卷列表（支持分页、搜索、筛选）
 * GET /api/question?keyword=xxx&page=1&pageSize=10&isStar=true&isDeleted=false
 */
export async function getQuestionList(
  opt: Partial<SearchOption> = {}
): Promise<ResDataType> {
  return await instance.get(`/api/question`, { params: opt })
}

/**
 * 更新问卷
 * PATCH /api/question/:id
 */
export async function updateQuestion(
  id: string,
  data: { [key: string]: any }
): Promise<ResDataType> {
  return await instance.patch(`/api/question/${id}`, data)
}

/**
 * 复制问卷
 * POST /api/question/duplicate/:id
 */
export async function duplicateQuestion(id: string): Promise<ResDataType> {
  return await instance.post(`/api/question/duplicate/${id}`)
}

/**
 * 批量删除（软删除）
 * DELETE /api/question
 * Body: { ids: ['id1', 'id2'] }
 */
export async function deleteQuestion(ids: string[]): Promise<ResDataType> {
  return await instance.delete('/api/question', { data: { ids } })
}

/**
 * 从回收站恢复
 * PATCH /api/question/:id/restore
 * 
 * @param id 问卷ID
 */
export async function restoreQuestion(id: string): Promise<ResDataType> {
  return await instance.patch(`/api/question/${id}/restore`)
}

/**
 * 永久删除
 * DELETE /api/question/:id/permanent
 * 
 * @param id 问卷ID
 */
export async function permanentDeleteQuestion(
  id: string
): Promise<ResDataType> {
  return await instance.delete(`/api/question/${id}/permanent`)
}

/**
 * 获取统计信息
 * GET /api/question/statistics
 * 
 * @returns 统计信息（总数、已发布、星标、已删除、正常）
 */
export async function getQuestionStatistics(): Promise<ResDataType> {
  return await instance.get(`/api/question/statistics`)
}
