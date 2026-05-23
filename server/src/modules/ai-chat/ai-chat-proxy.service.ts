import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  siliconFlowChatCompletion,
  SiliconFlowChatMessage,
} from './silicon-flow-chat'
import {
  getLlmApiKey,
  getLlmBaseUrl,
  getLlmModelId,
  getLlmProviderKind,
} from './llm.provider'

/**
 * AI Chat Proxy Service — OpenAI 兼容 Chat Completions
 */
@Injectable()
export class AIChatProxyService {
  constructor(private configService: ConfigService) {}

  private normalizeMessages(messages: SiliconFlowChatMessage[]): SiliconFlowChatMessage[] {
    const normalized = messages
      .map((m) => ({
        role: m.role,
        content: typeof m.content === 'string' ? m.content.trim() : '',
      }))
      .filter((m) => m.content.length > 0)

    if (normalized.length === 0) {
      throw new BadRequestException('消息内容不能为空')
    }

    if (!normalized.some((m) => m.role === 'user')) {
      throw new BadRequestException('至少需要一条 user 消息')
    }

    return normalized as SiliconFlowChatMessage[]
  }

  /** 非流式（续写 / 润色等） */
  async chat(messages: SiliconFlowChatMessage[]): Promise<string> {
    return siliconFlowChatCompletion(
      this.configService,
      this.normalizeMessages(messages),
      { maxTokens: 2000, temperature: 0.7 },
    )
  }

  /** 流式（旧接口） */
  async streamChat(messages: SiliconFlowChatMessage[]): Promise<ReadableStream> {
    const normalized = this.normalizeMessages(messages)
    const apiKey = getLlmApiKey(this.configService)
    const baseUrl = getLlmBaseUrl(this.configService)
    const model = getLlmModelId(this.configService)
    const providerKind = getLlmProviderKind(this.configService)

    const requestBody: Record<string, unknown> = {
      model,
      messages: normalized,
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    }

    if (providerKind === 'minimax') {
      requestBody.reasoning_split = true
    } else {
      requestBody.enable_thinking = false
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `AI API request failed: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`,
      )
    }

    return response.body as ReadableStream
  }
}
