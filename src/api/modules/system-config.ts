/**
 * 系统配置 API
 */
import instance from '../index'
import type { ResDataType } from '../index'
import type { SystemConfigItem, GroupedConfigs } from '@/types/system-config'

const BASE_URL = '/api/admin/system-config'

// ==================== 类型定义 ====================

// 重新导出类型供外部使用
export type { SystemConfigItem as SystemConfig, GroupedConfigs }

export interface UpdateConfigItem {
  key: string
  value: any
}

export interface BatchUpdateConfigRequest {
  configs: UpdateConfigItem[]
}

export interface QueryConfigParams {
  category?: string
  isPublic?: boolean
  isActive?: boolean
  keyword?: string
}

// ==================== API 函数 ====================

/**
 * 初始化默认配置
 */
export async function initializeConfigAPI(): Promise<ResDataType> {
  return await instance.post(`${BASE_URL}/initialize`)
}

/**
 * 获取所有配置（按分类分组）
 */
export async function getAllConfigsAPI(
  params?: QueryConfigParams
): Promise<GroupedConfigs> {
  return await instance.get(`${BASE_URL}`, { params })
}

/**
 * 获取公开配置（前端可访问）
 */
export async function getPublicConfigsAPI(): Promise<Record<string, any>> {
  return await instance.get(`${BASE_URL}/public`)
}

/**
 * 获取单个配置
 */
export async function getConfigByKeyAPI(key: string): Promise<SystemConfigItem> {
  return await instance.get(`${BASE_URL}/${key}`)
}

/**
 * 按分类获取配置
 */
export async function getConfigsByCategoryAPI(
  category: string
): Promise<Record<string, any>> {
  return await instance.get(`${BASE_URL}/category/${category}`)
}

/**
 * 更新单个配置
 */
export async function updateConfigAPI(
  key: string,
  value: any
): Promise<ResDataType> {
  return await instance.patch(`${BASE_URL}/${key}`, { key, value })
}

/**
 * 批量更新配置
 */
export async function batchUpdateConfigsAPI(
  data: BatchUpdateConfigRequest
): Promise<ResDataType> {
  return await instance.patch(`${BASE_URL}/batch`, data)
}

/**
 * 重置配置为默认值
 */
export async function resetConfigAPI(key: string): Promise<ResDataType> {
  return await instance.post(`${BASE_URL}/${key}/reset`)
}

// ==================== 配置分类获取函数 ====================

/**
 * 获取基础设置
 */
export async function getBasicSettingsAPI() {
  return await getConfigsByCategoryAPI('basic')
}

/**
 * 获取功能开关
 */
export async function getFeatureSettingsAPI() {
  return await getConfigsByCategoryAPI('feature')
}

/**
 * 获取安全设置
 */
export async function getSecuritySettingsAPI() {
  return await getConfigsByCategoryAPI('security')
}

/**
 * 获取业务规则
 */
export async function getBusinessRulesAPI() {
  return await getConfigsByCategoryAPI('business')
}

/**
 * 获取邮件配置
 */
export async function getEmailSettingsAPI() {
  return await getConfigsByCategoryAPI('email')
}

/**
 * 获取存储配置
 */
export async function getStorageSettingsAPI() {
  return await getConfigsByCategoryAPI('storage')
}

