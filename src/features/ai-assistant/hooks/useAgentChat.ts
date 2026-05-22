/**
 * Vercel AI SDK + AG-UI 流式对话（DefaultChatTransport -> /api/ai-chat/agent）
 */

import { useMemo, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { UIMessage } from 'ai'
import { AIContext } from '../types'
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

export function useAgentChat(context?: AIContext) {
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
        }),
      }),
    [],
  )

  const chat = useChat<UIMessage>({
    transport,
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
