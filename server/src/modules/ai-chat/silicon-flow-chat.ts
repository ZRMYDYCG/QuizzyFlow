import { ConfigService } from '@nestjs/config'
import {
  getLlmApiKey,
  getLlmBaseUrl,
  getLlmModelId,
  getLlmProviderKind,
} from './llm.provider'

export type SiliconFlowChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface SiliconFlowChatOptions {
  maxTokens?: number
  temperature?: number
}

/**
 * 调用 OpenAI 兼容 Chat Completions（MiniMax / 硅基流动）
 */
export async function siliconFlowChatCompletion(
  configService: ConfigService,
  messages: SiliconFlowChatMessage[],
  options: SiliconFlowChatOptions = {},
): Promise<string> {
  const apiKey = getLlmApiKey(configService)
  const baseUrl = getLlmBaseUrl(configService)
  const model = getLlmModelId(configService)
  const providerKind = getLlmProviderKind(configService)

  const normalized = messages
    .map((m) => ({
      role: m.role,
      content: typeof m.content === 'string' ? m.content.trim() : '',
    }))
    .filter((m) => m.content.length > 0)

  if (normalized.length === 0) {
    throw new Error('消息内容不能为空')
  }

  if (!normalized.some((m) => m.role === 'user')) {
    throw new Error('至少需要一条 user 消息')
  }

  const requestBody: Record<string, unknown> = {
    model,
    messages: normalized,
    stream: false,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 2000,
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

  const data = (await response.json().catch(() => ({}))) as {
    code?: number
    message?: string
    choices?: Array<{
      message?: {
        content?: string
        reasoning_content?: string
        reasoning_details?: Array<{ text?: string }>
      }
    }>
  }

  if (!response.ok || data.code) {
    throw new Error(
      `AI API request failed: ${response.status} ${response.statusText}. ${JSON.stringify(data)}`,
    )
  }

  const message = data.choices?.[0]?.message
  const content = message?.content?.trim() || ''
  const reasoning =
    message?.reasoning_content?.trim() ||
    message?.reasoning_details?.map((item) => item.text ?? '').join('').trim() ||
    ''

  if (content) return content

  if (reasoning) {
    return reasoning
  }

  throw new Error('AI 返回内容为空')
}
