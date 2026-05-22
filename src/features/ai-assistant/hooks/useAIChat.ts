/**
 * useAIChat Hook
 * AI 对话 + 操作提案持久化 + 应用状态同步
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { message as antdMessage } from 'antd'
import type { UIMessage } from 'ai'
import { Message, AIContext, UseAIChatReturn } from '../types'
import { useAgentChat } from './useAgentChat'
import {
  createChat,
  getLatestChat,
  syncMessages,
  applyChatAction,
  updateChat,
} from '@/api/modules/ai-chat'
import { useDebounceEffect } from 'ahooks'
import {
  mapDbMessageToLocal,
  mergeUiIntoChatMessages,
  dbMessagesToUIMessages,
  toSyncMessageDto,
} from '../utils/message-actions'

interface UseAIChatOptions {
  context?: AIContext
  onActionReceived?: (actions: import('../types').AIAction[]) => void
  autoSave?: boolean
  autoLoad?: boolean
}

export const useAIChat = (options: UseAIChatOptions = {}): UseAIChatReturn => {
  const { context, onActionReceived, autoSave = true, autoLoad = true } = options

  const [chatSessionId, setChatSessionId] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const isSavingRef = useRef(false)
  const lastNotifiedActionsRef = useRef<string>('')

  const {
    messages: uiMessages,
    setMessages: setUiMessages,
    isLoading,
    streamingContent,
    sendUserMessage,
    stop,
  } = useAgentChat(context)

  // 将 Agent UI 流合并为带 actions 的展示消息
  useEffect(() => {
    if (isLoadingHistory) return
    setChatMessages((prev) => mergeUiIntoChatMessages(uiMessages, prev, isLoading))
  }, [uiMessages, isLoading, isLoadingHistory])

  const loadLatestChat = useCallback(async () => {
    if (!context?.questionId || !autoLoad) return

    setIsLoadingHistory(true)
    try {
      const chatData: {
        _id?: string
        messages?: Array<{
          id: string
          role: string
          content: string
          timestamp: number
          actions?: Message['actions']
        }>
      } = await getLatestChat(context.questionId)

      if (chatData?.messages?.length) {
        const loaded = chatData.messages.map(mapDbMessageToLocal)
        setChatMessages(loaded)
        setUiMessages(dbMessagesToUIMessages(loaded))
        setChatSessionId(chatData._id ?? null)
      }
    } catch (error) {
      console.error('加载对话历史失败:', error)
    } finally {
      setIsLoadingHistory(false)
      setHistoryLoaded(true)
    }
  }, [context?.questionId, autoLoad, setUiMessages])

  const createNewSession = useCallback(async () => {
    if (!context?.questionId) return null

    try {
      const chatData: { _id: string } = await createChat({
        questionId: context.questionId,
        title: '未命名',
      })
      setChatSessionId(chatData._id)
      return chatData._id
    } catch (error) {
      console.error('创建对话会话失败:', error)
      return null
    }
  }, [context?.questionId])

  const updateChatTitle = useCallback(async (sessionId: string, title: string) => {
    const trimmed = title.trim() || '未命名'
    try {
      await updateChat(sessionId, { title: trimmed })
      return true
    } catch (error) {
      console.error('更新对话标题失败:', error)
      antdMessage.error('更新标题失败')
      return false
    }
  }, [])

  const saveMessages = useCallback(
    async (messagesToSave: Message[]) => {
      if (!autoSave || !context?.questionId || isSavingRef.current) return

      isSavingRef.current = true
      try {
        let sessionId = chatSessionId
        if (!sessionId) {
          sessionId = await createNewSession()
          if (!sessionId) return
        }

        await syncMessages(sessionId, toSyncMessageDto(messagesToSave))
      } catch (error) {
        console.error('保存对话失败:', error)
      } finally {
        isSavingRef.current = false
      }
    },
    [autoSave, context?.questionId, chatSessionId, createNewSession],
  )

  useDebounceEffect(
    () => {
      if (chatMessages.length > 0 && !isLoading) {
        saveMessages(chatMessages)
      }
    },
    [chatMessages, isLoading],
    { wait: 2000 },
  )

  useEffect(() => {
    if (context?.questionId && autoLoad && !historyLoaded) {
      loadLatestChat()
    }
  }, [context?.questionId, autoLoad, historyLoaded, loadLatestChat])

  useEffect(() => {
    if (!onActionReceived || isLoading) return
    const lastAssistant = [...chatMessages]
      .reverse()
      .find((m) => m.role === 'assistant')
    if (!lastAssistant?.actions?.length) return

    const pending = lastAssistant.actions.filter(
      (a) => a.type !== 'suggest_improvement' && !a.applied,
    )
    if (pending.length === 0) return

    const key = JSON.stringify(pending)
    if (key === lastNotifiedActionsRef.current) return
    lastNotifiedActionsRef.current = key
    onActionReceived(pending)
  }, [chatMessages, isLoading, onActionReceived])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) {
        antdMessage.warning('请输入消息内容')
        return
      }
      if (isLoading) {
        antdMessage.warning('AI 正在思考中，请稍候...')
        return
      }

      try {
        await sendUserMessage(content)
      } catch (error) {
        console.error('Send message error:', error)
        antdMessage.error('发送消息失败')
      }
    },
    [isLoading, sendUserMessage],
  )

  const clearMessages = useCallback(() => {
    setUiMessages([])
    setChatMessages([])
    lastNotifiedActionsRef.current = ''
  }, [setUiMessages])

  const stopStreaming = useCallback(() => {
    stop()
  }, [stop])

  const setMessagesFromHistory = useCallback(
    (newMessages: Message[], sessionId: string) => {
      const loaded = newMessages.map(mapDbMessageToLocal)
      setChatMessages(loaded)
      setUiMessages(dbMessagesToUIMessages(loaded))
      setChatSessionId(sessionId)
      lastNotifiedActionsRef.current = ''
    },
    [setUiMessages],
  )

  const markActionApplied = useCallback(
    async (messageId: string, actionId: string) => {
      setChatMessages((prev) =>
        prev.map((m) => {
          if (m.id !== messageId) return m
          return {
            ...m,
            actions: m.actions?.map((a) =>
              a.id === actionId
                ? { ...a, applied: true, appliedAt: Date.now() }
                : a,
            ),
          }
        }),
      )

      if (!chatSessionId) {
        return
      }

      try {
        await applyChatAction(chatSessionId, messageId, actionId)
      } catch (error) {
        console.error('标记操作已应用失败:', error)
        antdMessage.error('保存应用状态失败')
      }
    },
    [chatSessionId],
  )

  return {
    messages: chatMessages,
    isLoading,
    streamingContent,
    sendMessage,
    clearMessages,
    stopStreaming,
    chatSessionId,
    isLoadingHistory,
    loadLatestChat,
    createNewSession,
    updateChatTitle,
    setMessagesFromHistory,
    markActionApplied,
  }
}
