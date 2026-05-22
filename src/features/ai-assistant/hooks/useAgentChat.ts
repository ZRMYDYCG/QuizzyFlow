/**
 * Vercel AI SDK + AG-UI 流式对话（DefaultChatTransport -> /api/ai-chat/agent）
 */

import { useMemo, useRef, type RefObject } from 'react'
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

export function useAgentChat(
  context?: AIContext,
  chatSessionIdRef?: RefObject<string | null>,
  messageAttachmentsRef?: RefObject<Record<string, AttachedComponentRef[]>>,
  pendingAttachmentsRef?: RefObject<AttachedComponentRef[] | null>,
) {
  const contextRef = useRef(context)
  contextRef.current = context

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/ai-chat/agent',
        headers: () => ({
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        }),
        body: () => ({
          context: buildAgentContextBody(contextRef.current),
          chatId: chatSessionIdRef?.current ?? undefined,
          attachedComponents: pendingAttachmentsRef?.current ?? undefined,
          messageAttachments: messageAttachmentsRef?.current ?? undefined,
        }),
      }),
    [],
  )

  const chat = useChat<UIMessage>({
    transport,
    // 流式时节流 UI 更新，避免每 token 触发重渲染导致内存暴涨
    experimental_throttle: 50,
  })

  const isLoading =
    chat.status === 'submitted' || chat.status === 'streaming'

  const localMessages = chat.messages.map((msg) =>
    uiMessageToLocalMessage(
      msg,
      isLoading && msg.id === chat.messages[chat.messages.length - 1]?.id &&
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
