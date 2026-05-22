import {
  TextAIActionType,
  TranslateTargetLanguage,
} from '../dto/process-text.dto'
import { getTranslateLanguageLabel } from './translate-languages'

export function buildTextAIMessages(
  action: TextAIActionType,
  text: string,
  context?: string,
  targetLanguage?: TranslateTargetLanguage,
): Array<{ role: 'system' | 'user'; content: string }> {
  const ctx = context ? `\n使用场景：${context}` : ''
  const targetLabel = targetLanguage
    ? getTranslateLanguageLabel(targetLanguage)
    : '英文（若原文为中文）或中文（若原文为外文）'

  const userPrompts: Record<TextAIActionType, string> = {    continue: `请基于下列文字继续写下去，语气风格一致。只输出续写的新增内容，不要重复原文，不要解释。

原文：
${text}${ctx}`,

    polish: `请润色下列文字，使其更流畅专业。只输出润色后的对应片段（长度与原文相当），不要解释。

原文：
${text}${ctx}`,

    translate: `请将下列文字翻译为${targetLabel}。只输出译文，不要解释。

原文：
${text}`,

    rewrite: `请用不同说法改写下列文字，保持原意。只输出改写结果，不要解释。

原文：
${text}${ctx}`,

    simplify: `请精简下列文字，去掉冗余。只输出精简结果，不要解释。

原文：
${text}`,

    expand: `请扩写下列文字，补充合理细节。只输出扩写结果，不要解释。

原文：
${text}${ctx}`,
  }

  return [
    {
      role: 'system',
      content:
        '你是问卷文案助手。严格按用户要求输出结果，不要加引号、标题或 Markdown 代码块。',
    },
    { role: 'user', content: userPrompts[action] },
  ]
}
