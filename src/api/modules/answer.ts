import instance from '../index.ts'
import type { ResDataType } from '../index.ts'

/**
 * 答案项接口
 */
export interface AnswerItem {
  componentId: string // 组件ID (fe_id)
  componentType: string // 组件类型
  value: any // 答案值
}

/**
 * 提交答卷数据接口
 */
export interface SubmitAnswerData {
  questionId: string
  answerList: AnswerItem[]
  duration?: number // 答题用时（秒）
}

/**
 * 答卷列表查询参数
 */
export interface QueryAnswerParams {
  questionId: string
  page?: number
  pageSize?: number
}

/**
 * 提交答卷（无需认证）
 * POST /api/answer
 */
export async function submitAnswer(data: SubmitAnswerData): Promise<ResDataType> {
  return await instance.post('/api/answer', data)
}

/**
 * 获取问卷的答卷列表（需要认证）
 * GET /api/answer?questionId=xxx&page=1&pageSize=10
 */
export async function getAnswerList(params: QueryAnswerParams): Promise<ResDataType> {
  return await instance.get('/api/answer', { params })
}

/**
 * 获取单个答卷详情（需要认证）
 * GET /api/answer/:id
 */
export async function getAnswerById(id: string): Promise<ResDataType> {
  return await instance.get(`/api/answer/${id}`)
}

/**
 * 删除答卷（需要认证）
 * DELETE /api/answer/:id
 */
export async function deleteAnswer(id: string): Promise<ResDataType> {
  return await instance.delete(`/api/answer/${id}`)
}

