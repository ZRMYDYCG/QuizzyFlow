import instance from './index'
import type { Node, Edge, Viewport } from 'reactflow'

const BASE_URL = '/api/flow'

export interface FlowData {
  _id: string
  title: string
  description: string
  thumbnail?: string
  isStar: boolean
  isDeleted: boolean
  nodeCount: number
  edgeCount: number
  author: string
  createdAt: string
  updatedAt: string
  nodes?: Node[]
  edges?: Edge[]
  viewport?: Viewport
}

export interface FlowListResponse {
  list: FlowData[]
  total: number
  page: number
  pageSize: number
}

// 创建工作流
export async function createFlow(data?: {
  title?: string
  description?: string
  nodes?: Node[]
  edges?: Edge[]
  viewport?: Viewport
}): Promise<FlowData> {
  return await instance.post(BASE_URL, data)
}

// 获取工作流列表
export async function getFlowList(params: {
  page?: number
  pageSize?: number
  keyword?: string
  isStar?: boolean
  isDeleted?: boolean
}): Promise<FlowListResponse> {
  return await instance.get(BASE_URL, { params })
}

// 获取单个工作流
export async function getFlow(id: string): Promise<FlowData> {
  return await instance.get(`${BASE_URL}/${id}`)
}

// 更新工作流
export async function updateFlow(
  id: string,
  data: Partial<FlowData>,
): Promise<FlowData> {
  return await instance.patch(`${BASE_URL}/${id}`, data)
}

// 批量删除
export async function batchDeleteFlow(ids: string[]) {
  return await instance.delete(BASE_URL, { data: { ids } })
}

// 恢复工作流
export async function restoreFlow(id: string) {
  return await instance.patch(`${BASE_URL}/${id}/restore`)
}

// 永久删除
export async function permanentDeleteFlow(id: string) {
  return await instance.delete(`${BASE_URL}/${id}/permanent`)
}

// 复制工作流
export async function duplicateFlow(id: string): Promise<FlowData> {
  return await instance.post(`${BASE_URL}/duplicate/${id}`)
}

// 更新缩略图
export async function updateFlowThumbnail(id: string, thumbnail: string) {
  return await instance.post(`${BASE_URL}/${id}/thumbnail`, { thumbnail })
}

// 获取统计
export async function getFlowStatistics() {
  return await instance.get(`${BASE_URL}/statistics`)
}

