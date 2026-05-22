import { ConfigService } from '@nestjs/config'
import { getSiliconFlowModelId } from './silicon-flow.provider'

export type SiliconFlowChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface SiliconFlowChatOptions {
  maxTokens?: number
  temperature?: number
}

/**
 * 调用硅基流动 Chat Completions（OpenAI 兼容）
 * - 必须传非空 messages，否则 20014 Message field is required
 * - Qwen3.6 等推理模型需 enable_thinking: false，否则 content 可能为空
 */
export async function siliconFlowChatCompletion(
  configService: ConfigService,
  messages: SiliconFlowChatMessage[],
  options: SiliconFlowChatOptions = {},
): Promise<string> {
  const apiKey = configService.get<string>('SILICON_FLOW_API_KEY') || ''
  const baseUrl =
    configService.get<string>('SILICON_FLOW_BASE_URL') ||
    'https://api.siliconflow.cn/v1'
  const model = getSiliconFlowModelId(configService)

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

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: normalized,
      stream: false,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
      enable_thinking: false,
    }),
  })

  const data = (await response.json().catch(() => ({}))) as {
    code?: number
    message?: string
    choices?: Array<{
      message?: {
        content?: string
        reasoning_content?: string
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
  const reasoning = message?.reasoning_content?.trim() || ''

  if (content) return content

  if (reasoning) {
    return reasoning
  }

  throw new Error('AI 返回内容为空')
}
