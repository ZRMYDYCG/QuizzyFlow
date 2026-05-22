import { ConfigService } from '@nestjs/config'
import { createOpenAI } from '@ai-sdk/openai'
import { createSiliconFlowFetch } from './silicon-flow-reasoning-stream'

/** 硅基流动 OpenAI 兼容 Chat Completions（勿用 Responses API） */
export function createSiliconFlowProvider(configService: ConfigService) {
  const apiKey = configService.get<string>('SILICON_FLOW_API_KEY') || ''
  const baseURL =
    configService.get<string>('SILICON_FLOW_BASE_URL') ||
    'https://api.siliconflow.cn/v1'

  return createOpenAI({
    apiKey,
    baseURL,
    fetch: createSiliconFlowFetch(),
  })
}

export function getSiliconFlowModelId(configService: ConfigService): string {
  return (
    configService.get<string>('SILICON_FLOW_MODEL') ||
    'Qwen/Qwen2.5-7B-Instruct'
  )
}
