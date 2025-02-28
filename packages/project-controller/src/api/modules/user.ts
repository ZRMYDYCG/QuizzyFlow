import instance from '../index.ts'
import type { ResDataType } from '../index.ts'

/**
 * 获取用户信息
 * */
export const getUserInfo = async (): Promise<ResDataType> => {
  return await instance.get('/api/auth/profile')
}

/**
 * 用户登录
 * */
export const loginUser = async (params: any): Promise<ResDataType> => {
  return await instance.post('/api/auth/login', params)
}

/**
 * 用户注册
 * */
export const registerUser = async (params: any): Promise<ResDataType> => {
  return await instance.post('/api/user/register', params)
}
