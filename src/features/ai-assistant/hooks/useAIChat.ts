/**
 * useAIChat Hook
 * AI 对话 + 多会话切换 + 刷新续聊 + 操作提案持久化
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { message as antdMessage } from 'antd'
import type { UIMessage } from 'ai'
import { Message, AIContext, UseAIChatReturn, AttachedComponentRef } from '../types'
import { useAgentChat } from './useAgentChat'
import {
  createChat,
  getLatestChat,
  getChatDetail,
  syncMessages,
  applyChatAction,
  updateChat,
  markChatOpened,
} from '@/api/modules/ai-chat'
import { useDebounceEffect } from 'ahooks'
import {
  mapDbMessageToLocal,
  mergeUiIntoChatMessages,
  dbMessagesToUIMessages,
  toSyncMessageDto,
} from '../utils/message-actions'
import { getActiveChatId, setActiveChatId } from '../utils/chat-session-storage'
import { isLocalFollowUpActionId } from '../utils/follow-up'

interface UseAIChatOptions {
  context?: AIContext
  onActionReceived?: (actions: import('../types').AIAction[]) => void
  autoSave?: boolean
  autoLoad?: boolean
}

type ChatDetail = {
  _id?: string
  isDeleted?: boolean
  messages?: Array<{
    id: string
    role: string
    content: string
    timestamp: number
    actions?: Message['actions']
    attachedComponents?: AttachedComponentRef[]
  }>
}

export const useAIChat = (options: UseAIChatOptions = {}): UseAIChatReturn => {
  const { context, onActionReceived, autoSave = true, autoLoad = true } = options

  const [chatSessionId, setChatSessionId] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isSwitchingSession, setIsSwitchingSession] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)

  const chatSessionIdRef = useRef<string | null>(null)
  const saveGenerationRef = useRef(0)
  const isSavingRef = useRef(false)
  const lastNotifiedActionsRef = useRef<string>('')
  const prevIsLoadingRef = useRef(false)
  const pendingSaveAfterStreamRef = useRef(false)
  const prevQuestionIdRef = useRef(context?.questionId)
  const chatMessagesRef = useRef<Message[]>([])
  const contextRef = useRef(context)
  contextRef.current = context

  const chatSessionIdRefForAgent = useRef<string | null>(null)
  chatSessionIdRefForAgent.current = chatSessionId

  const messageAttachmentsRef = useRef<Record<string, AttachedComponentRef[]>>({})
  const pendingAttachmentsRef = useRef<AttachedComponentRef[] | null>(null)

  const {
    messages: uiMessages,
    setMessages: setUiMessages,
    isLoading,
    streamingContent,
    sendUserMessage,
    stop,
  } = useAgentChat(
    context,
    chatSessionIdRefForAgent,
    messageAttachmentsRef,
    pendingAttachmentsRef,
  )

  useEffect(() => {
    chatSessionIdRef.current = chatSessionId
  }, [chatSessionId])

  useEffect(() => {
    chatMessagesRef.current = chatMessages
  }, [chatMessages])

  // 问卷切换时重置并重新加载
  useEffect(() => {
    if (prevQuestionIdRef.current === context?.questionId) return
    prevQuestionIdRef.current = context?.questionId
    saveGenerationRef.current += 1
    setHistoryLoaded(false)
    setChatSessionId(null)
    chatSessionIdRef.current = null
    setChatMessages([])
    setUiMessages([])
    messageAttachmentsRef.current = {}
    pendingAttachmentsRef.current = null
    lastNotifiedActionsRef.current = ''
  }, [context?.questionId, setUiMessages])

  // 将 Agent UI 流合并为带 actions 的展示消息
  useEffect(() => {
    if (isLoadingHistory || isSwitchingSession) return
    setChatMessages((prev) => {
      const next = mergeUiIntoChatMessages(
        uiMessages,
        prev,
        isLoading,
        contextRef.current,
        {
          pendingAttachments: pendingAttachmentsRef.current,
          messageAttachmentsMap: messageAttachmentsRef.current,
        },
      )

      // 将 pending 引用写入 map，供后续请求与持久化
      for (const msg of next) {
        if (
          msg.role === 'user' &&
          msg.attachedComponents?.length &&
          !messageAttachmentsRef.current[msg.id]
        ) {
          messageAttachmentsRef.current[msg.id] = msg.attachedComponents
          if (pendingAttachmentsRef.current?.length) {
            pendingAttachmentsRef.current = null
          }
        }
      }
      if (next.length === prev.length) {
        let unchanged = true
        for (let i = 0; i < next.length; i += 1) {
          const a = next[i]
          const b = prev[i]
          if (
            a.id !== b.id ||
            a.content !== b.content ||
            a.reasoning !== b.reasoning ||
            a.isStreaming !== b.isStreaming ||
            a.isReasoningStreaming !== b.isReasoningStreaming ||
            a.followUpUsed !== b.followUpUsed ||
            a.followUpActionId !== b.followUpActionId ||
            a.contentDisplay !== b.contentDisplay ||
            (a.attachedComponents?.length ?? 0) !== (b.attachedComponents?.length ?? 0) ||
            (a.actions?.length ?? 0) !== (b.actions?.length ?? 0) ||
            (a.toolCalls?.length ?? 0) !== (b.toolCalls?.length ?? 0)
          ) {
            unchanged = false
            break
          }
        }
        if (unchanged) return prev
      }
      return next
    })
  }, [uiMessages, isLoading, isLoadingHistory, isSwitchingSession])

  const persistActiveSession = useCallback(
    async (sessionId: string) => {
      if (!context?.questionId) return
      setActiveChatId(context.questionId, sessionId)
      try {
        await markChatOpened(sessionId)
      } catch {
        // 非关键路径，localStorage 已足够用于续聊
      }
    },
    [context?.questionId],
  )

  const applyChatData = useCallback(
    (chatData: ChatDetail) => {
      const sessionId = chatData._id ?? null
      if (!sessionId) return

      setChatSessionId(sessionId)
      chatSessionIdRef.current = sessionId

      const loaded = (chatData.messages ?? []).map(mapDbMessageToLocal)
      const attachmentMap: Record<string, AttachedComponentRef[]> = {}
      for (const msg of loaded) {
        if (msg.attachedComponents?.length) {
          attachmentMap[msg.id] = msg.attachedComponents
        }
      }
      messageAttachmentsRef.current = attachmentMap
      setChatMessages(loaded)
      setUiMessages(dbMessagesToUIMessages(loaded))
      lastNotifiedActionsRef.current = ''
    },
    [setUiMessages],
  )

  const loadActiveChat = useCallback(async () => {
    if (!context?.questionId || !autoLoad) return

    setIsLoadingHistory(true)
    try {
      const questionId = context.questionId
      const storedId = getActiveChatId(questionId)

      if (storedId) {
        try {
          const chatData = (await getChatDetail(storedId)) as ChatDetail
          if (chatData?._id && !chatData.isDeleted) {
            applyChatData(chatData)
            await persistActiveSession(storedId)
            return
          }
        } catch {
          setActiveChatId(questionId, null)
        }
      }

      const latest = (await getLatestChat(questionId)) as ChatDetail | null
      if (latest?._id) {
        applyChatData(latest)
        await persistActiveSession(latest._id)
      }
    } catch (error) {
      console.error('加载对话历史失败:', error)
    } finally {
      setIsLoadingHistory(false)
      setHistoryLoaded(true)
    }
  }, [context?.questionId, autoLoad, applyChatData, persistActiveSession])

  const createNewSession = useCallback(async () => {
    if (!context?.questionId) return null

    stop()
    saveGenerationRef.current += 1

    try {
      const chatData = (await createChat({
        questionId: context.questionId,
        title: '未命名',
      })) as { _id: string }

      setChatSessionId(chatData._id)
      chatSessionIdRef.current = chatData._id
      setChatMessages([])
      setUiMessages([])
      messageAttachmentsRef.current = {}
      pendingAttachmentsRef.current = null
      lastNotifiedActionsRef.current = ''
      await persistActiveSession(chatData._id)
      return chatData._id
    } catch (error) {
      console.error('创建对话会话失败:', error)
      return null
    }
  }, [context?.questionId, stop, setUiMessages, persistActiveSession])

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
    async (messagesToSave: Message[], forcedSessionId?: string | null) => {
      const generation = saveGenerationRef.current
      const sessionId = forcedSessionId ?? chatSessionIdRef.current

      if (!autoSave || !context?.questionId || !sessionId || isSavingRef.current) return
      if (messagesToSave.length === 0) return
      if (messagesToSave.some((m) => m.isStreaming)) return

      const payload = toSyncMessageDto(messagesToSave)
      if (payload.length === 0) return

      isSavingRef.current = true
      try {
        await syncMessages(sessionId, payload)
        if (generation !== saveGenerationRef.current) return
      } catch (error) {
        console.error('保存对话失败:', error)
        antdMessage.error('对话保存失败，刷新后可能丢失记录')
      } finally {
        isSavingRef.current = false
      }
    },
    [autoSave, context?.questionId],
  )

  const tryFlushPendingSave = useCallback(() => {
    if (!pendingSaveAfterStreamRef.current || isLoading) return
    const messages = chatMessagesRef.current
    if (messages.length === 0) return
    if (messages.some((m) => m.isStreaming)) return

    pendingSaveAfterStreamRef.current = false
    void saveMessages(messages)
  }, [isLoading, saveMessages])

  // 合并完成后尝试保存（等 isStreaming 清除）
  useEffect(() => {
    tryFlushPendingSave()
  }, [chatMessages, tryFlushPendingSave])

  // 流式结束后标记待保存，等消息合并且 isStreaming 清除后再写入
  useEffect(() => {
    if (prevIsLoadingRef.current && !isLoading) {
      pendingSaveAfterStreamRef.current = true
    }
    prevIsLoadingRef.current = isLoading
  }, [isLoading])

  // 用户发出消息后、AI 开始回复时先保存用户消息，避免刷新丢失
  useEffect(() => {
    if (isLoadingHistory || isSwitchingSession || !isLoading) return
    const messages = chatMessagesRef.current
    if (messages.length === 0 || messages.some((m) => m.isStreaming)) return
    const last = messages[messages.length - 1]
    if (last.role === 'user') {
      void saveMessages(messages)
    }
  }, [isLoading, chatMessages, isLoadingHistory, isSwitchingSession, saveMessages])

  useDebounceEffect(
    () => {
      if (chatMessages.length > 0 && !isLoading && !chatMessages.some((m) => m.isStreaming)) {
        saveMessages(chatMessages)
      }
    },
    [chatMessages, isLoading],
    { wait: 800 },
  )

  useEffect(() => {
    if (context?.questionId && autoLoad && !historyLoaded) {
      loadActiveChat()
    }
  }, [context?.questionId, autoLoad, historyLoaded, loadActiveChat])

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
    async (content: string, attachedComponents?: AttachedComponentRef[]) => {
      if (!content.trim() && !attachedComponents?.length) {
        antdMessage.warning('请输入消息内容或拖入问卷项')
        return
      }
      if (isLoading) {
        antdMessage.warning('AI 正在思考中，请稍候...')
        return
      }

      try {
        if (!chatSessionIdRef.current) {
          const id = await createNewSession()
          if (!id) return
        }
        pendingAttachmentsRef.current = attachedComponents?.length
          ? attachedComponents
          : null
        await sendUserMessage(content.trim() || '请分析我引用的问卷组件')
      } catch (error) {
        pendingAttachmentsRef.current = null
        console.error('Send message error:', error)
        antdMessage.error('发送消息失败')
      }
    },
    [isLoading, sendUserMessage, createNewSession],
  )

  const clearMessages = useCallback(() => {
    stop()
    saveGenerationRef.current += 1
    setUiMessages([])
    setChatMessages([])
    messageAttachmentsRef.current = {}
    pendingAttachmentsRef.current = null
    setChatSessionId(null)
    chatSessionIdRef.current = null
    if (context?.questionId) {
      setActiveChatId(context.questionId, null)
    }
    lastNotifiedActionsRef.current = ''
  }, [stop, setUiMessages, context?.questionId])

  const stopStreaming = useCallback(() => {
    stop()
  }, [stop])

  const setMessagesFromHistory = useCallback(
    (newMessages: Message[], sessionId: string) => {
      const loaded = newMessages.map(mapDbMessageToLocal)
      const attachmentMap: Record<string, AttachedComponentRef[]> = {}
      for (const msg of loaded) {
        if (msg.attachedComponents?.length) {
          attachmentMap[msg.id] = msg.attachedComponents
        }
      }
      messageAttachmentsRef.current = attachmentMap
      pendingAttachmentsRef.current = null
      setChatMessages(loaded)
      setUiMessages(dbMessagesToUIMessages(loaded))
      setChatSessionId(sessionId)
      chatSessionIdRef.current = sessionId
      lastNotifiedActionsRef.current = ''
      void persistActiveSession(sessionId)
    },
    [setUiMessages, persistActiveSession],
  )

  const switchToSession = useCallback(
    async (sessionId: string) => {
      if (sessionId === chatSessionIdRef.current) return true

      stop()
      saveGenerationRef.current += 1
      setIsSwitchingSession(true)

      try {
        const chatData = (await getChatDetail(sessionId)) as ChatDetail
        if (!chatData?._id) {
          antdMessage.error('对话不存在')
          return false
        }

        applyChatData(chatData)
        await persistActiveSession(sessionId)
        return true
      } catch (error) {
        console.error('切换对话失败:', error)
        antdMessage.error('加载对话失败，请重试')
        return false
      } finally {
        setIsSwitchingSession(false)
      }
    },
    [stop, applyChatData, persistActiveSession],
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

      if (!chatSessionIdRef.current) {
        return
      }

      try {
        await applyChatAction(chatSessionIdRef.current, messageId, actionId)
      } catch (error) {
        console.error('标记操作已应用失败:', error)
        antdMessage.error('保存应用状态失败')
      }
    },
    [],
  )

  const markFollowUpHandled = useCallback(
    async (messageId: string, actionId: string) => {
      setChatMessages((prev) =>
        prev.map((m) => {
          if (m.id !== messageId) return m
          return {
            ...m,
            followUpUsed: true,
            actions: m.actions?.map((a) =>
              a.id === actionId || a.type === 'follow_up'
                ? { ...a, applied: true, appliedAt: Date.now() }
                : a,
            ),
          }
        }),
      )

      if (!chatSessionIdRef.current) return
      if (isLocalFollowUpActionId(actionId)) return

      try {
        await applyChatAction(chatSessionIdRef.current, messageId, actionId)
      } catch (error) {
        console.error('标记引导追问已处理失败:', error)
      }
    },
    [],
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
    isSwitchingSession,
    loadLatestChat: loadActiveChat,
    createNewSession,
    updateChatTitle,
    switchToSession,
    setMessagesFromHistory,
    markActionApplied,
    markFollowUpHandled,
  }
}
