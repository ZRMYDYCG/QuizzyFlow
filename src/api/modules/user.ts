import instance from '../index.ts'
import type { ResDataType } from '../index.ts'

/**
 * 登录参数
 */
export interface LoginParams {
  username: string // 邮箱
  password: string
}

/**
 * 注册参数
 */
export interface RegisterParams {
  username: string // 邮箱
  password: string
  nickname: string
}

/**
 * 修改密码参数
 */
export interface ChangePasswordParams {
  oldPassword: string
  newPassword: string
}

/**
 * 用户信息
 */
export interface UserInfo {
  _id: string
  username: string
  nickname: string
  isActive: boolean
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date
}

/**
 * 登录响应
 */
export interface LoginResponse {
  token: string
  user: UserInfo
}

/**
 * 用户登录
 * POST /api/auth/login
 */
export const loginUser = async (
  params: LoginParams
): Promise<ResDataType> => {
  return await instance.post('/api/auth/login', params)
}

/**
 * 用户注册
 * POST /api/user/register
 */
export const registerUser = async (
  params: RegisterParams
): Promise<ResDataType> => {
  return await instance.post('/api/user/register', params)
}

/**
 * 获取当前用户信息
 * GET /api/auth/profile
 */
export const getUserInfo = async (): Promise<ResDataType> => {
  return await instance.get('/api/auth/profile')
}

/**
 * 修改密码
 * PATCH /api/user/password
 */
export const changePassword = async (
  params: ChangePasswordParams
): Promise<ResDataType> => {
  return await instance.patch('/api/user/password', params)
}
