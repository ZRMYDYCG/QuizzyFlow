/**
 * Text AI Service
 * 文本 AI 处理服务（续写、润色、翻译等）
 */

import instance from '@/api/index'

/**
 * AI 文本操作类型
 */
export type TextAIAction =
  | 'continue' // 续写
  | 'polish' // 润色
  | 'translate' // 翻译
  | 'rewrite' // 改写
  | 'simplify' // 精简
  | 'expand' // 扩写

/**
 * AI 文本处理请求
 */
export interface TextAIRequest {
  action: TextAIAction
  text: string
  context?: string // 额外上下文信息
}

/**
 * 构建文本处理的 Prompt
 */
const buildTextPrompt = (action: TextAIAction, text: string, context?: string): string => {
  const prompts: Record<TextAIAction, string> = {
    continue: `请基于以下文字继续写下去，保持语气和风格一致。只输出续写的内容，不要重复原文。

原文：
${text}

${context ? `上下文：${context}` : ''}

续写内容：`,

    polish: `请优化润色以下文字，使其更加流畅、专业、易懂。只输出润色后的完整文字。

原文：
${text}

${context ? `使用场景：${context}` : ''}

润色后：`,

    translate: `请翻译以下文字。如果是中文则翻译成英文，如果是英文则翻译成中文。只输出翻译结果。

原文：
${text}

翻译：`,

    rewrite: `请用不同的表达方式改写以下文字，保持原意但换一种说法。只输出改写后的文字。

原文：
${text}

${context ? `使用场景：${context}` : ''}

改写后：`,

    simplify: `请精简以下文字，去除冗余，保留核心意思，使其更简洁。只输出精简后的文字。

原文：
${text}

精简后：`,

    expand: `请扩写以下文字，添加更多细节和说明，使其更详细完整。只输出扩写后的文字。

原文：
${text}

${context ? `使用场景：${context}` : ''}

扩写后：`,
  }

  return prompts[action]
}

/**
 * 调用 AI 处理文本
 */
export const processTextWithAI = async (
  action: TextAIAction,
  text: string,
  context?: string
): Promise<string> => {
  try {
    console.log('📡 [textAI] 开始调用 AI API')
    console.log('📡 [textAI] action:', action)
    console.log('📡 [textAI] text:', text)

    const prompt = buildTextPrompt(action, text, context)
    console.log('📡 [textAI] prompt:', prompt.substring(0, 100) + '...')

    // 调用后端 AI 接口（非流式）
    console.log('📡 [textAI] 调用接口: POST /api/ai-chat/text')
    
    const response: any = await instance.post('/api/ai-chat/text', {
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    console.log('📡 [textAI] 响应:', response)
    
    const result = response.result || response.content || ''
    console.log('📡 [textAI] 提取结果:', result)

    return result
  } catch (error) {
    console.error('❌ [textAI] 处理失败:', error)
    console.error('❌ [textAI] 错误详情:', {
      message: (error as any)?.message,
      response: (error as any)?.response,
      status: (error as any)?.response?.status,
    })
    throw error
  }
}

/**
 * 操作描述
 */
export const getActionLabel = (action: TextAIAction): string => {
  const labels: Record<TextAIAction, string> = {
    continue: '✨ AI 续写',
    polish: '🎨 AI 润色',
    translate: '🌍 翻译',
    rewrite: '📝 改写',
    simplify: '✂️ 精简',
    expand: '📏 扩写',
  }
  return labels[action]
}

/**
 * 操作图标
 */
export const getActionIcon = (action: TextAIAction): string => {
  const icons: Record<TextAIAction, string> = {
    continue: '✨',
    polish: '🎨',
    translate: '🌍',
    rewrite: '📝',
    simplify: '✂️',
    expand: '📏',
  }
  return icons[action]
}

