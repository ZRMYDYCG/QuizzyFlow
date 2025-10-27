import instance from '../index'
import type { ResDataType } from '../index'

const BASE_URL = '/api/admin'

// ==================== 用户管理 ====================

export interface QueryUsersParams {
  page?: number
  pageSize?: number
  keyword?: string
  role?: string
  isActive?: boolean
  isBanned?: boolean
  sortBy?: 'createdAt' | 'lastLoginAt' | 'username'
  sortOrder?: 'asc' | 'desc'
}

export interface CreateAdminUserData {
  username: string
  password: string
  nickname: string
  role: string
  phone?: string
  bio?: string
}

export interface UpdateUserRoleData {
  role: string
  customPermissions?: string[]
}

export interface BanUserData {
  isBanned: boolean
  reason: string
}

/**
 * 获取用户列表
 */
export async function getUsersAPI(
  params: QueryUsersParams
): Promise<ResDataType> {
  return await instance.get(`${BASE_URL}/users`, { params })
}

/**
 * 获取用户详情
 */
export async function getUserDetailAPI(id: string): Promise<ResDataType> {
  return await instance.get(`${BASE_URL}/users/${id}`)
}

/**
 * 创建管理员用户
 */
export async function createAdminUserAPI(
  data: CreateAdminUserData
): Promise<ResDataType> {
  return await instance.post(`${BASE_URL}/users`, data)
}

/**
 * 更新用户角色
 */
export async function updateUserRoleAPI(
  id: string,
  data: UpdateUserRoleData
): Promise<ResDataType> {
  return await instance.patch(`${BASE_URL}/users/${id}/role`, data)
}

/**
 * 封禁/解封用户
 */
export async function banUserAPI(
  id: string,
  data: BanUserData
): Promise<ResDataType> {
  return await instance.patch(`${BASE_URL}/users/${id}/ban`, data)
}

/**
 * 重置用户密码
 */
export async function resetUserPasswordAPI(
  id: string,
  newPassword: string
): Promise<ResDataType> {
  return await instance.patch(`${BASE_URL}/users/${id}/reset-password`, {
    newPassword,
  })
}

/**
 * 删除用户
 */
export async function deleteUserAPI(id: string): Promise<ResDataType> {
  return await instance.delete(`${BASE_URL}/users/${id}`)
}

// ==================== 统计数据 ====================

/**
 * 获取系统统计数据
 */
export async function getSystemStatisticsAPI(): Promise<ResDataType> {
  return await instance.get(`${BASE_URL}/statistics`)
}

/**
 * 获取用户活跃度
 */
export async function getUserActivityAPI(
  days: number = 30
): Promise<ResDataType> {
  return await instance.get(`${BASE_URL}/statistics/user-activity`, {
    params: { days },
  })
}

// ==================== 角色管理 ====================

export interface CreateRoleData {
  name: string
  displayName: string
  description?: string
  permissions?: string[]
  isActive?: boolean
  priority?: number
}

export interface UpdateRoleData extends Partial<CreateRoleData> {}

export interface QueryRolesParams {
  keyword?: string
  isSystem?: boolean
  isActive?: boolean
}

/**
 * 获取角色列表
 */
export async function getRolesAPI(
  params?: QueryRolesParams
): Promise<ResDataType> {
  return await instance.get('/api/admin/roles', { params })
}

/**
 * 获取角色详情
 */
export async function getRoleDetailAPI(id: string): Promise<ResDataType> {
  return await instance.get(`/api/admin/roles/${id}`)
}

/**
 * 创建角色
 */
export async function createRoleAPI(
  data: CreateRoleData
): Promise<ResDataType> {
  return await instance.post('/api/admin/roles', data)
}

/**
 * 更新角色
 */
export async function updateRoleAPI(
  id: string,
  data: UpdateRoleData
): Promise<ResDataType> {
  return await instance.patch(`/api/admin/roles/${id}`, data)
}

/**
 * 删除角色
 */
export async function deleteRoleAPI(id: string): Promise<ResDataType> {
  return await instance.delete(`/api/admin/roles/${id}`)
}

/**
 * 设置角色权限
 */
export async function setRolePermissionsAPI(
  id: string,
  permissions: string[]
): Promise<ResDataType> {
  return await instance.patch(`/api/admin/roles/${id}/permissions`, { permissions })
}

/**
 * 获取角色统计
 */
export async function getRoleStatisticsAPI(): Promise<ResDataType> {
  return await instance.get('/api/admin/roles/statistics')
}

// ==================== 权限管理 ====================

export interface QueryPermissionsParams {
  module?: string
  action?: string
  isSystem?: boolean
  isActive?: boolean
  keyword?: string
}

/**
 * 获取权限列表
 */
export async function getPermissionsAPI(
  params?: QueryPermissionsParams
): Promise<ResDataType> {
  return await instance.get('/api/admin/permissions', { params })
}

/**
 * 按模块分组获取权限
 */
export async function getGroupedPermissionsAPI(): Promise<ResDataType> {
  return await instance.get('/api/admin/permissions/grouped')
}

/**
 * 初始化系统权限
 */
export async function initializePermissionsAPI(): Promise<ResDataType> {
  return await instance.post('/api/admin/permissions/initialize')
}

// ==================== 操作日志 ====================

export interface QueryLogsParams {
  page?: number
  pageSize?: number
  operatorId?: string
  module?: string
  action?: string
  resource?: string
  status?: 'success' | 'failed'
  startDate?: string
  endDate?: string
  keyword?: string
}

/**
 * 获取操作日志列表
 */
export async function getLogsAPI(
  params: QueryLogsParams
): Promise<ResDataType> {
  return await instance.get('/api/admin/logs', { params })
}

/**
 * 获取日志详情
 */
export async function getLogDetailAPI(id: string): Promise<ResDataType> {
  return await instance.get(`/api/admin/logs/${id}`)
}

/**
 * 获取最近的操作日志
 */
export async function getRecentLogsAPI(limit: number = 10): Promise<ResDataType> {
  return await instance.get('/api/admin/logs/recent/list', { params: { limit } })
}

/**
 * 获取日志统计
 */
export async function getLogStatisticsAPI(days: number = 30): Promise<ResDataType> {
  return await instance.get('/api/admin/logs/statistics/summary', { params: { days } })
}

