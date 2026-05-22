/**
 * AI Chat API
 * AI 对话历史相关接口
 */

import instance from '../index'
import type { ResDataType } from '../index'

// ==================== 类型定义 ====================

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  reasoning?: string
  timestamp: number
  actions?: ChatAction[]
}

export interface ChatAction {
  id: string
  type: string
  data: Record<string, unknown>
  description?: string
  applied?: boolean
  appliedAt?: number
}

export interface ChatSession {
  _id: string
  questionId: string
  author: string
  title: string
  messages: ChatMessage[]
  isDeleted: boolean
  lastMessageAt: string
  lastOpenedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateChatDto {
  questionId: string
  title?: string
}

export interface AddMessageDto {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  reasoning?: string
  timestamp: number
  actions?: ChatAction[]
}

export interface QueryChatDto {
  questionId?: string
  page?: number
  pageSize?: number
}

// ==================== API 方法 ====================

/**
 * 创建新的对话会话
 */
export async function createChat(data: CreateChatDto): Promise<ResDataType> {
  return await instance.post('/api/ai-chat', data)
}

/**
 * 获取指定问卷的对话列表
 */
export async function getChatsByQuestion(
  questionId: string,
  params?: QueryChatDto
): Promise<ResDataType> {
  return await instance.get(`/api/ai-chat/question/${questionId}`, { params })
}

/**
 * 获取指定问卷的最近一次对话（自动恢复用）
 */
export async function getLatestChat(questionId: string): Promise<ResDataType> {
  return await instance.get(`/api/ai-chat/question/${questionId}/latest`)
}

/**
 * 获取对话详情
 */
export async function getChatDetail(id: string): Promise<ResDataType> {
  return await instance.get(`/api/ai-chat/${id}`)
}

/**
 * 添加消息到对话
 */
export async function addMessage(id: string, message: AddMessageDto): Promise<ResDataType> {
  return await instance.post(`/api/ai-chat/${id}/message`, message)
}

/**
 * 批量添加消息
 */
export async function batchAddMessages(
  id: string,
  messages: AddMessageDto[]
): Promise<ResDataType> {
  return await instance.post(`/api/ai-chat/${id}/messages/batch`, messages)
}

/**
 * 同步消息（覆盖式更新）
 */
export async function syncMessages(id: string, messages: AddMessageDto[]): Promise<ResDataType> {
  return await instance.patch(`/api/ai-chat/${id}/messages/sync`, messages)
}

/**
 * 标记某条消息下的操作为已应用
 */
export async function applyChatAction(
  chatId: string,
  messageId: string,
  actionId: string,
): Promise<ResDataType> {
  return await instance.patch(
    `/api/ai-chat/${chatId}/messages/${encodeURIComponent(messageId)}/actions/${encodeURIComponent(actionId)}/apply`,
  )
}

/**
 * 标记会话为最近打开（切换 / 恢复时）
 */
export async function markChatOpened(id: string): Promise<ResDataType> {
  return await instance.patch(`/api/ai-chat/${id}/open`)
}

/**
 * 更新对话信息
 */
export async function updateChat(id: string, data: { title?: string }): Promise<ResDataType> {
  return await instance.patch(`/api/ai-chat/${id}`, data)
}

/**
 * 删除对话
 */
export async function deleteChat(id: string): Promise<ResDataType> {
  return await instance.delete(`/api/ai-chat/${id}`)
}

/**
 * 清空指定问卷的所有对话
 */
export async function clearChatsByQuestion(questionId: string): Promise<ResDataType> {
  return await instance.delete(`/api/ai-chat/question/${questionId}/clear`)
}

