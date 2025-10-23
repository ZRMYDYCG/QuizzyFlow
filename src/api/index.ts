import axios from 'axios'
import { message } from 'antd'

export interface ResType {
  errno: number
  data?: ResDataType
  msg?: string
}

export interface ResDataType {
  [key: string]: any
}

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  async (response) => {
    const res = (response.data || {}) as ResType
    const { errno, data, msg } = res
    if (errno !== 0) {
      if (msg) {
        await message.error(msg)
      }
      throw new Error(msg)
    }
    return data as any
  },
  async (error) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { data } = error.response
      const errorMsg = data?.msg || data?.message || '请求失败'
      await message.error(errorMsg)
      return Promise.reject(new Error(errorMsg))
    }
    
    // 网络错误
    await message.error('网络错误，请检查连接')
    return Promise.reject(error)
  }
)

export default instance
