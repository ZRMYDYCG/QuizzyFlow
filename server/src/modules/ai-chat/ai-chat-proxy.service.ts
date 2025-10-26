import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

/**
 * AI Chat Proxy Service
 * 代理硅基流动 API 调用（保护 API Key）
 */
@Injectable()
export class AIChatProxyService {
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly model: string

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('SILICON_FLOW_API_KEY') || ''
    this.baseUrl =
      this.configService.get<string>('SILICON_FLOW_BASE_URL') ||
      'https://api.siliconflow.cn/v1'
    this.model =
      this.configService.get<string>('SILICON_FLOW_MODEL') || 'Qwen/Qwen2.5-7B-Instruct'
  }

  /**
   * 流式调用硅基流动 API
   */
  async streamChat(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  ): Promise<ReadableStream> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `AI API request failed: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`,
      )
    }

    return response.body as ReadableStream
  }

  /**
   * 非流式调用
   */
  async chat(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  ): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `AI API request failed: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`,
      )
    }

    const data = await response.json()

    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content
    }

    throw new Error('Invalid AI response format')
  }
}

