import { ConfigService } from '@nestjs/config'
import { createOpenAI } from '@ai-sdk/openai'
import { createLlmFetch, type LlmProviderKind } from './llm-reasoning-stream'

export type { LlmProviderKind }

export function getLlmProviderKind(configService: ConfigService): LlmProviderKind {
  const explicit = configService.get<string>('LLM_PROVIDER')?.trim().toLowerCase()
  if (explicit === 'minimax' || explicit === 'siliconflow') {
    return explicit
  }

  const baseUrl =
    configService.get<string>('LLM_BASE_URL') ||
    configService.get<string>('MINIMAX_BASE_URL') ||
    configService.get<string>('SILICON_FLOW_BASE_URL') ||
    ''

  if (/minimax/i.test(baseUrl)) {
    return 'minimax'
  }
  if (/siliconflow/i.test(baseUrl)) {
    return 'siliconflow'
  }

  if (configService.get<string>('MINIMAX_API_KEY') || configService.get<string>('LLM_API_KEY')) {
    return 'minimax'
  }

  return 'siliconflow'
}

export function getLlmApiKey(configService: ConfigService): string {
  return (
    configService.get<string>('LLM_API_KEY') ||
    configService.get<string>('MINIMAX_API_KEY') ||
    configService.get<string>('SILICON_FLOW_API_KEY') ||
    ''
  )
}

export function getLlmBaseUrl(configService: ConfigService): string {
  const configured =
    configService.get<string>('LLM_BASE_URL') ||
    configService.get<string>('MINIMAX_BASE_URL') ||
    configService.get<string>('SILICON_FLOW_BASE_URL')

  if (configured) {
    return configured
  }

  return getLlmProviderKind(configService) === 'minimax'
    ? 'https://api.minimaxi.com/v1'
    : 'https://api.siliconflow.cn/v1'
}

export function getLlmModelId(configService: ConfigService): string {
  return (
    configService.get<string>('LLM_MODEL') ||
    configService.get<string>('MINIMAX_MODEL') ||
    configService.get<string>('SILICON_FLOW_MODEL') ||
    (getLlmProviderKind(configService) === 'minimax'
      ? 'MiniMax-M2.7'
      : 'Qwen/Qwen2.5-7B-Instruct')
  )
}

/** OpenAI 兼容 Chat Completions Provider（MiniMax / 硅基流动） */
export function createLlmProvider(configService: ConfigService) {
  const providerKind = getLlmProviderKind(configService)

  return createOpenAI({
    apiKey: getLlmApiKey(configService),
    baseURL: getLlmBaseUrl(configService),
    fetch: createLlmFetch(providerKind),
  })
}

// 兼容旧命名
export const createSiliconFlowProvider = createLlmProvider
export const getSiliconFlowModelId = getLlmModelId
