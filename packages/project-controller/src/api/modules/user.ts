import instance from '../index.ts'
import type { ResDataType } from '../index.ts'

export const getUserInfo = async (): Promise<ResDataType> => {
  return await instance.get('/api/user/info')
}

export const registerUser = async (params: any): Promise<ResDataType> => {
  return await instance.post('/api/user/register', params)
}

export const loginUser = async (params: any): Promise<ResDataType> => {
  return await instance.post('/api/user/login', params)
}
