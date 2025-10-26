/**
 * useAIChat Hook
 * AI 对话核心逻辑（支持历史记录）
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { message as antdMessage } from 'antd'
import { nanoid } from 'nanoid'
import { Message, AIContext, UseAIChatReturn } from '../types'
import { streamChat } from '../services/siliconflow'
import { buildSystemMessage, buildUserMessage } from '../services/promptBuilder'
import { parseAIResponse } from '../services/responseParser'
import {
  createChat,
  getLatestChat,
  syncMessages,
  type ChatSession,
  type AddMessageDto,
} from '@/api/modules/ai-chat'
import { useDebounceEffect } from 'ahooks'

interface UseAIChatOptions {
  context?: AIContext
  onActionReceived?: (actions: any[]) => void
  autoSave?: boolean // 是否自动保存对话
  autoLoad?: boolean // 是否自动加载最近的对话
}

export const useAIChat = (options: UseAIChatOptions = {}): UseAIChatReturn => {
  const { context, onActionReceived, autoSave = true, autoLoad = true } = options

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [chatSessionId, setChatSessionId] = useState<string | null>(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const abortControllerRef = useRef<AbortController | null>(null)
  const currentMessageIdRef = useRef<string>('')
  const isSavingRef = useRef(false)

  /**
   * 加载最近的对话历史
   */
  const loadLatestChat = useCallback(async () => {
    if (!context?.questionId || !autoLoad) return

    setIsLoadingHistory(true)
    try {
      const chatData: any = await getLatestChat(context.questionId)
      if (chatData && chatData.messages && chatData.messages.length > 0) {
        // 转换服务器消息格式为本地格式
        const loadedMessages: Message[] = chatData.messages.map((msg: any): Message => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          actions: msg.actions,
        }))

        setMessages(loadedMessages)
        setChatSessionId(chatData._id)
        console.log('✅ 已加载历史对话:', chatData.title)
      }
    } catch (error) {
      console.error('加载对话历史失败:', error)
    } finally {
      setIsLoadingHistory(false)
    }
  }, [context?.questionId, autoLoad])

  /**
   * 创建新的对话会话
   */
  const createNewSession = useCallback(async () => {
    if (!context?.questionId) return null

    try {
      const chatData: any = await createChat({
        questionId: context.questionId,
        title: `${context.questionTitle || '问卷'} - AI 对话`,
      })
      setChatSessionId(chatData._id)
      console.log('✅ 创建新对话会话:', chatData._id)
      return chatData._id
    } catch (error) {
      console.error('创建对话会话失败:', error)
      return null
    }
  }, [context?.questionId, context?.questionTitle])

  /**
   * 保存消息到服务器
   */
  const saveMessages = useCallback(
    async (messagesToSave: Message[]) => {
      if (!autoSave || !context?.questionId || isSavingRef.current) return

      isSavingRef.current = true

      try {
        // 如果还没有会话 ID，先创建会话
        let sessionId = chatSessionId
        if (!sessionId) {
          sessionId = await createNewSession()
          if (!sessionId) return
        }

        // 转换消息格式
        const messagesDto: AddMessageDto[] = messagesToSave.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          actions: msg.actions,
        }))

        // 同步消息到服务器
        await syncMessages(sessionId, messagesDto)
        console.log('对话已保存到服务器')
      } catch (error) {
        console.error('保存对话失败:', error)
      } finally {
        isSavingRef.current = false
      }
    },
    [autoSave, context?.questionId, chatSessionId, createNewSession]
  )

  /**
   * 防抖自动保存
   */
  useDebounceEffect(
    () => {
      if (messages.length > 0) {
        saveMessages(messages)
      }
    },
    [messages],
    { wait: 2000 } // 2秒后保存
  )

  /**
   * 加载历史记录（组件挂载时）
   */
  useEffect(() => {
    if (context?.questionId && autoLoad) {
      loadLatestChat()
    }
  }, [context?.questionId]) // 只在 questionId 变化时加载

  /**
   * 发送消息
   */
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
        setIsLoading(true)
        setStreamingContent('')

        // 创建用户消息
        const userMessage: Message = {
          id: nanoid(),
          role: 'user',
          content,
          timestamp: Date.now(),
        }

        // 添加到消息列表
        setMessages((prev) => [...prev, userMessage])

        // 创建 AI 消息占位符
        const aiMessageId = nanoid()
        currentMessageIdRef.current = aiMessageId

        const aiMessage: Message = {
          id: aiMessageId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          isStreaming: true,
        }

        setMessages((prev) => [...prev, aiMessage])

        // 构建 API 请求消息
        const systemMessage = buildSystemMessage()
        const userMsg = buildUserMessage(content, context)

        // 包含历史对话（最近 5 条）
        const historyMessages = messages.slice(-5).map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }))

        const apiMessages = [systemMessage, ...historyMessages, userMsg]

        // 创建 AbortController 用于取消请求
        abortControllerRef.current = new AbortController()

        let fullContent = ''

        // 调用流式 API
        await streamChat(
          apiMessages,
          // onChunk
          (chunk) => {
            fullContent += chunk
            setStreamingContent(fullContent)

            // 更新 AI 消息内容
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId ? { ...msg, content: fullContent, isStreaming: true } : msg
              )
            )
          },
          // onComplete
          () => {
            setIsLoading(false)
            setStreamingContent('')

            // 解析 AI 响应，提取 actions
            const { text, actions } = parseAIResponse(fullContent)

            // 更新最终消息
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? {
                      ...msg,
                      content: fullContent,
                      actions: actions.length > 0 ? actions : undefined,
                      isStreaming: false,
                    }
                  : msg
              )
            )

            // 通知外部有 actions
            if (actions.length > 0 && onActionReceived) {
              onActionReceived(actions)
            }
          },
          // onError
          (error) => {
            setIsLoading(false)
            setStreamingContent('')

            console.error('AI Chat error:', error)

            // 更新错误消息
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? {
                      ...msg,
                      content: `抱歉，发生了错误：${error.message}`,
                      isStreaming: false,
                    }
                  : msg
              )
            )

            antdMessage.error('AI 响应失败，请重试')
          },
          abortControllerRef.current.signal
        )
      } catch (error) {
        setIsLoading(false)
        setStreamingContent('')
        console.error('Send message error:', error)
        antdMessage.error('发送消息失败')
      }
    },
    [context, isLoading, messages, onActionReceived]
  )

  /**
   * 清空消息
   */
  const clearMessages = useCallback(() => {
    setMessages([])
    setStreamingContent('')
  }, [])

  /**
   * 停止流式响应
   */
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsLoading(false)
    setStreamingContent('')

    // 标记当前消息为已完成
    if (currentMessageIdRef.current) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === currentMessageIdRef.current ? { ...msg, isStreaming: false } : msg
        )
      )
    }
  }, [])

  /**
   * 设置消息列表（用于加载历史对话）
   */
  const setMessagesFromHistory = useCallback((newMessages: Message[], sessionId: string) => {
    setMessages(newMessages)
    setChatSessionId(sessionId)
  }, [])

  return {
    messages,
    isLoading,
    streamingContent,
    sendMessage,
    clearMessages,
    stopStreaming,
    chatSessionId,
    isLoadingHistory,
    loadLatestChat,
    createNewSession,
    setMessagesFromHistory,
  }
}

