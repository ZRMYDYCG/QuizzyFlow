/**
 * Prompt Builder（兼容文本 AI；主对话已迁移至服务端 Agent 系统提示词）
 */

import { AIContext } from '../types'
import { getMaterialLibraryJSON } from '../shared/material-library'

export { getMaterialLibraryJSON }

const LEGACY_ACTION_HINT = `
当需要修改问卷结构时，在回复中使用 \`\`\`action JSON\`\`\` 代码块（旧版兼容）。
新版对话通过 Agent 工具自动提案，用户点击「应用此操作」确认。
`

/**
 * 精简系统说明（供 /api/ai-chat/text 等非 Agent 接口）
 */
export const buildLegacySystemPrompt = (): string => {
  return `你是 QuizzyFlow 问卷助手。

## 物料库
\`\`\`json
${getMaterialLibraryJSON()}
\`\`\`

## 组件格式
{ "fe_id": "c_xxx", "type": "question-input", "title": "标题", "props": { "title": "...", ... } }

${LEGACY_ACTION_HINT}
`
}

export const buildSystemMessage = () => ({
  role: 'system' as const,
  content: buildLegacySystemPrompt(),
})

export const buildUserMessage = (userMessage: string, context?: AIContext) => {
  let content = ''

  if (context) {
    content += '【当前问卷上下文】\n'
    if (context.questionTitle) {
      content += `问卷标题：${context.questionTitle}\n`
    }
    if (context.currentComponents?.length) {
      content += `\n现有组件（${context.currentComponents.length}个）：\n`
      content += JSON.stringify(
        context.currentComponents.map((comp) => ({
          fe_id: comp.fe_id,
          type: comp.type,
          title: comp.title,
        })),
        null,
        2,
      )
      content += '\n\n'
    }
  }

  content += `【用户问题】\n${userMessage}`

  return {
    role: 'user' as const,
    content,
  }
}

export const generateComponentId = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = 'c_'
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

/** @deprecated 使用 buildLegacySystemPrompt */
export const buildPrompt = buildLegacySystemPrompt
