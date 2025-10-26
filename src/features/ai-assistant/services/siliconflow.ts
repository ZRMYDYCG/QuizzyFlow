/**
 * Silicon Flow API Service
 * 通过后端代理调用硅基流动 API（安全）
 */

import { SiliconFlowRequest } from '../types'

// 后端 API 地址
const BACKEND_API_URL = '/api/ai-chat/stream'

/**
 * 调用后端代理的 AI Chat API（流式响应）
 */
export const streamChat = async (
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  signal?: AbortSignal
): Promise<void> => {
  try {
    // 调用后端代理接口
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 从 localStorage 获取 token
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({ messages }),
      signal,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      )
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Failed to get response reader')
    }

    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        onComplete()
        break
      }

      // 解码数据
      buffer += decoder.decode(value, { stream: true })

      // 处理 SSE 格式的数据
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // 保留不完整的行

      for (const line of lines) {
        const trimmedLine = line.trim()

        // 跳过空行和注释
        if (!trimmedLine || trimmedLine.startsWith(':')) {
          continue
        }

        // 解析 SSE 数据
        if (trimmedLine.startsWith('data:')) {
          const data = trimmedLine.slice(5).trim()

          // 检查是否是结束标记
          if (data === '[DONE]') {
            onComplete()
            return
          }

          try {
            const parsed = JSON.parse(data)

            // 提取内容
            if (parsed.choices && parsed.choices[0]?.delta?.content) {
              const content = parsed.choices[0].delta.content
              onChunk(content)
            }
          } catch (parseError) {
            console.error('Failed to parse SSE data:', data, parseError)
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      // 检查是否是用户取消
      if (error.name === 'AbortError') {
        console.log('Request aborted by user')
        onComplete()
        return
      }
      onError(error)
    } else {
      onError(new Error('Unknown error occurred'))
    }
  }
}

/**
 * 非流式 Chat API（用于快速响应场景）
 * 注意：目前主要使用流式 API，此方法保留用于未来扩展
 */
export const chat = async (
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  signal?: AbortSignal
): Promise<string> => {
  // 暂时通过流式 API 实现非流式调用
  return new Promise((resolve, reject) => {
    let fullContent = ''

    streamChat(
      messages,
      (chunk) => {
        fullContent += chunk
      },
      () => {
        resolve(fullContent)
      },
      (error) => {
        reject(error)
      },
      signal
    )
  })
}

/**
 * 测试 API 连接
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    await chat([
      {
        role: 'user',
        content: 'Hello',
      },
    ])
    return true
  } catch (error) {
    console.error('API connection test failed:', error)
    return false
  }
}

/**
 * 检查 API 配置是否完整
 */
export const checkAPIConfig = (): { valid: boolean; message: string } => {
  if (!SILICON_FLOW_API_KEY) {
    return {
      valid: false,
      message: '请在 .env 文件中配置 VITE_SILICON_FLOW_API_KEY',
    }
  }

  if (!SILICON_FLOW_BASE_URL) {
    return {
      valid: false,
      message: '请在 .env 文件中配置 VITE_SILICON_FLOW_BASE_URL',
    }
  }

  return {
    valid: true,
    message: 'API 配置正常',
  }
}

