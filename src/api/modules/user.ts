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
 * 编辑器设置
 */
export interface EditorSettings {
  autoSave: boolean
  autoSaveInterval: number
  defaultScale: number
  showGrid: boolean
  showRulers: boolean
}

/**
 * 用户偏好设置
 */
export interface UserPreferences {
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US'
  editorSettings: EditorSettings
  listView: 'card' | 'table'
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
  avatar?: string
  bio?: string
  phone?: string
  preferences?: UserPreferences
}

/**
 * 更新个人信息参数
 */
export interface UpdateProfileParams {
  nickname?: string
  avatar?: string
  bio?: string
  phone?: string
}

/**
 * 更新偏好设置参数
 */
export interface UpdatePreferencesParams {
  theme?: 'light' | 'dark'
  language?: 'zh-CN' | 'en-US'
  editorSettings?: Partial<EditorSettings>
  listView?: 'card' | 'table'
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
 * 获取用户完整信息
 * GET /api/user/profile
 */
export const getUserProfile = async (): Promise<ResDataType> => {
  return await instance.get('/api/user/profile')
}

/**
 * 更新个人信息
 * PATCH /api/user/profile
 */
export const updateProfile = async (
  params: UpdateProfileParams
): Promise<ResDataType> => {
  return await instance.patch('/api/user/profile', params)
}

/**
 * 更新用户偏好设置
 * PATCH /api/user/preferences
 */
export const updatePreferences = async (
  params: UpdatePreferencesParams
): Promise<ResDataType> => {
  return await instance.patch('/api/user/preferences', params)
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

/**
 * 上传头像
 * POST /api/user/avatar
 */
export const uploadAvatar = async (file: File): Promise<ResDataType> => {
  const formData = new FormData()
  formData.append('file', file)
  return await instance.post('/api/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 获取用户统计数据
 * GET /api/user/statistics
 */
export const getUserStatistics = async (): Promise<ResDataType> => {
  return await instance.get('/api/user/statistics')
}
