/**
 * 文本 AI 服务（续写、润色、翻译等）
 */

import instance from '@/api/index'

export type TextAIAction =
  | 'continue'
  | 'polish'
  | 'translate'
  | 'rewrite'
  | 'simplify'
  | 'expand'

export const TRANSLATE_TARGET_LANGUAGES = [
  'zh',
  'en',
  'ja',
  'ko',
  'fr',
  'de',
  'es',
] as const

export type TranslateTargetLanguage = (typeof TRANSLATE_TARGET_LANGUAGES)[number]

export const TRANSLATE_LANGUAGE_OPTIONS: Array<{
  value: TranslateTargetLanguage
  label: string
}> = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: '英文' },
  { value: 'ja', label: '日文' },
  { value: 'ko', label: '韩文' },
  { value: 'fr', label: '法文' },
  { value: 'de', label: '德文' },
  { value: 'es', label: '西班牙文' },
]

export interface TextAIRequest {
  action: TextAIAction
  text: string
  context?: string
  targetLanguage?: TranslateTargetLanguage
}

export interface TextAIApplyOptions {
  targetLanguage?: TranslateTargetLanguage
}

/** 清理模型输出中的多余包裹 */
export function sanitizeAIText(raw: string): string {
  let text = raw.trim()
  if (!text) return ''

  // 去掉 markdown 代码块
  const codeBlock = text.match(/^```[\w]*\n?([\s\S]*?)```$/m)
  if (codeBlock) {
    text = codeBlock[1].trim()
  }

  // 去掉首尾引号
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith('「') && text.endsWith('」')) ||
    (text.startsWith('『') && text.endsWith('』'))
  ) {
    text = text.slice(1, -1).trim()
  }

  return text
}

export const processTextWithAI = async (
  action: TextAIAction,
  text: string,
  context?: string,
  targetLanguage?: TranslateTargetLanguage,
): Promise<string> => {
  const data = await instance.post(
    '/api/ai-chat/text',
    { action, text, context, targetLanguage },
    { timeout: 60000 },
  )

  const raw =
    (typeof data === 'string' ? data : data?.result || data?.content) ?? ''
  const result = sanitizeAIText(String(raw))

  if (!result) {
    throw new Error('AI 未返回有效内容')
  }

  return result
}

export const getActionLabel = (action: TextAIAction): string => {
  const labels: Record<TextAIAction, string> = {
    continue: '续写',
    polish: '润色',
    translate: '翻译',
    rewrite: '改写',
    simplify: '精简',
    expand: '扩写',
  }
  return labels[action]
}
