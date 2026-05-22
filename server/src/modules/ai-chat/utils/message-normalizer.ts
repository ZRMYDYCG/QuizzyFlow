import { AddMessageDto } from '../dto/add-message.dto'
import { ChatAction, ChatMessage } from '../schemas/ai-chat.schema'

/** 前端使用 id，Mongo 子文档使用 actionId（避免与 Mongoose _id 冲突） */
export function normalizeActionFromClient(action: {
  id?: string
  actionId?: string
  type: string
  data: Record<string, unknown>
  description?: string
  applied?: boolean
  appliedAt?: number
}): ChatAction {
  return {
    actionId: action.actionId ?? action.id ?? '',
    type: action.type,
    data: action.data ?? {},
    description: action.description,
    applied: !!action.applied,
    appliedAt: action.appliedAt,
  }
}

export function serializeActionForClient(action: ChatAction) {
  return {
    id: action.actionId,
    type: action.type,
    data: action.data,
    description: action.description,
    applied: action.applied,
    appliedAt: action.appliedAt,
  }
}

export function normalizeMessagesForDb(messages: AddMessageDto[]): ChatMessage[] {
  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp,
    actions: msg.actions?.map((a) =>
      normalizeActionFromClient(a as Parameters<typeof normalizeActionFromClient>[0]),
    ),
  }))
}

export function serializeChatForClient(chat: {
  toObject?: () => Record<string, unknown>
  messages?: ChatMessage[]
}) {
  const doc =
    typeof chat.toObject === 'function'
      ? (chat.toObject() as Record<string, unknown>)
      : (chat as Record<string, unknown>)

  const messages = (doc.messages as ChatMessage[] | undefined)?.map((msg) => ({
    ...msg,
    actions: msg.actions?.map(serializeActionForClient),
  }))

  return {
    ...doc,
    messages,
  }
}
