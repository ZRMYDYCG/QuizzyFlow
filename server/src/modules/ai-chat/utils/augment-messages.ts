/**
 * 将用户消息引用的问卷组件注入模型上下文（token 优化后的精简 JSON）
 */

export interface CompactAttachedComponent {
  fe_id: string
  type: string
  title: string
  props?: Record<string, unknown>
}

const ATTACHMENT_BLOCK_PREFIX = '\n\n---\n引用的问卷组件（JSON）：\n'

function extractTextFromUiMessage(msg: Record<string, unknown>): string {
  const parts = msg.parts as Array<{ type?: string; text?: string }> | undefined
  if (Array.isArray(parts)) {
    return parts
      .filter((p) => p.type === 'text' && typeof p.text === 'string')
      .map((p) => p.text as string)
      .join('')
  }
  if (typeof msg.content === 'string') return msg.content
  return ''
}

function setTextOnUiMessage(
  msg: Record<string, unknown>,
  text: string,
): Record<string, unknown> {
  const parts = msg.parts as Array<{ type?: string; text?: string }> | undefined
  if (Array.isArray(parts)) {
    let replaced = false
    const nextParts = parts.map((part) => {
      if (part.type === 'text' && !replaced) {
        replaced = true
        return { ...part, text }
      }
      return part
    })
    if (!replaced) {
      nextParts.push({ type: 'text', text })
    }
    return { ...msg, parts: nextParts }
  }
  return { ...msg, content: text }
}

function resolveAttachmentsForMessage(
  messageId: string | undefined,
  messageAttachments: Record<string, CompactAttachedComponent[]> | undefined,
  attachedComponents: CompactAttachedComponent[] | undefined,
  isLastUserMessage: boolean,
): CompactAttachedComponent[] | undefined {
  if (messageId && messageAttachments?.[messageId]?.length) {
    return messageAttachments[messageId]
  }
  if (isLastUserMessage && attachedComponents?.length) {
    return attachedComponents
  }
  return undefined
}

export function augmentUiMessagesWithAttachments(
  uiMessages: unknown[],
  options?: {
    attachedComponents?: CompactAttachedComponent[]
    messageAttachments?: Record<string, CompactAttachedComponent[]>
  },
): unknown[] {
  if (!uiMessages.length) return uiMessages

  const messageAttachments = options?.messageAttachments
  const attachedComponents = options?.attachedComponents
  if (
    !attachedComponents?.length &&
    (!messageAttachments || Object.keys(messageAttachments).length === 0)
  ) {
    return uiMessages
  }

  const lastUserIndex = [...uiMessages]
    .map((m, i) => ({ m, i }))
    .reverse()
    .find(({ m }) => (m as { role?: string }).role === 'user')?.i

  return uiMessages.map((raw, index) => {
    const msg = raw as Record<string, unknown>
    if (msg.role !== 'user') return raw

    const messageId = typeof msg.id === 'string' ? msg.id : undefined
    const attachments = resolveAttachmentsForMessage(
      messageId,
      messageAttachments,
      attachedComponents,
      index === lastUserIndex,
    )
    if (!attachments?.length) return raw

    const originalText = extractTextFromUiMessage(msg)
    const block = `${ATTACHMENT_BLOCK_PREFIX}${JSON.stringify(attachments)}`
    if (originalText.includes(ATTACHMENT_BLOCK_PREFIX.trim())) {
      return raw
    }

    return setTextOnUiMessage(msg, `${originalText}${block}`)
  })
}
