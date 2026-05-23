/**
 * Vercel AI SDK + AG-UI 流式对话（DefaultChatTransport -> /api/ai-chat/agent）
 */

import { useMemo, type RefObject } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { UIMessage } from 'ai'
import { AIContext, AttachedComponentRef } from '../types'
import { uiMessageToLocalMessage } from '../utils/tool-parts'

function buildAgentContextBody(context?: AIContext) {
  if (!context) return undefined
  return {
    questionId: context.questionId,
    questionTitle: context.questionTitle,
    questionDesc: context.questionDesc,
    selectedComponentId: context.selectedComponentId,
    currentComponents: context.currentComponents?.map((c) => ({
      fe_id: c.fe_id,
      type: c.type,
      title: c.title,
      props: c.props,
    })),
  }
}

export interface UseAgentChatOptions {
  questionId?: string
  contextRef: RefObject<AIContext | undefined>
  chatSessionIdRef?: RefObject<string | null>
  messageAttachmentsRef?: RefObject<Record<string, AttachedComponentRef[]>>
  pendingAttachmentsRef?: RefObject<AttachedComponentRef[] | null>
}

export function useAgentChat({
  questionId,
  contextRef,
  chatSessionIdRef,
  messageAttachmentsRef,
  pendingAttachmentsRef,
}: UseAgentChatOptions) {
  // 与 DB session 解耦：同一问卷内切换历史会话时不重建 Chat，避免 setMessages 失效与更新环
  const chatId = useMemo(
    () => (questionId ? `quizzy-agent-${questionId}` : 'quizzy-agent-draft'),
    [questionId],
  )

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/ai-chat/agent',
        headers: () => ({
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        }),
        body: () => ({
          context: buildAgentContextBody(contextRef.current ?? undefined),
          chatId: chatSessionIdRef?.current ?? undefined,
          attachedComponents: pendingAttachmentsRef?.current ?? undefined,
          messageAttachments: messageAttachmentsRef?.current ?? undefined,
        }),
      }),
    [],
  )

  const chat = useChat<UIMessage>({
    id: chatId,
    transport,
    // 流式时节流 UI 更新，避免 Markdown/合并逻辑触发 Maximum update depth
    experimental_throttle: 100,
  })

  const isLoading =
    chat.status === 'submitted' || chat.status === 'streaming'

  const localMessages = chat.messages.map((msg) =>
    uiMessageToLocalMessage(
      msg,
      isLoading &&
        msg.id === chat.messages[chat.messages.length - 1]?.id &&
        msg.role === 'assistant',
    ),
  )

  const streamingContent =
    isLoading && chat.messages.length > 0
      ? uiMessageToLocalMessage(chat.messages[chat.messages.length - 1]).content
      : ''

  return {
    messages: chat.messages,
    setMessages: chat.setMessages,
    sendMessage: chat.sendMessage,
    stop: chat.stop,
    status: chat.status,
    error: chat.error,
    localMessages,
    isLoading,
    streamingContent,
    sendUserMessage: (text: string) => chat.sendMessage({ text }),
  }
}
