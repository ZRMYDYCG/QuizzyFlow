/**
 * useAIChatSession Hook
 * 专门处理对话会话的加载和切换
 */

import { useState, useCallback } from 'react'
import { message } from 'antd'
import { getChatDetail, type ChatSession } from '@/api/modules/ai-chat'
import { Message } from '../types'

export const useAIChatSession = () => {
  const [isLoadingSession, setIsLoadingSession] = useState(false)

  /**
   * 加载指定的对话会话
   */
  const loadChatSession = useCallback(
    async (chatId: string): Promise<{ messages: Message[]; sessionId: string } | null> => {
      setIsLoadingSession(true)
      try {
        const chatData: any = await getChatDetail(chatId)

        if (!chatData || !chatData.messages) {
          message.error('对话数据格式错误')
          return null
        }

        // 转换服务器消息格式为本地格式
        const loadedMessages: Message[] = chatData.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          actions: msg.actions,
        }))

        console.log(`✅ 已加载对话: ${chatData.title}，共 ${loadedMessages.length} 条消息`)

        return {
          messages: loadedMessages,
          sessionId: chatData._id,
        }
      } catch (error) {
        console.error('加载对话失败:', error)
        message.error('加载对话失败，请重试')
        return null
      } finally {
        setIsLoadingSession(false)
      }
    },
    []
  )

  return {
    loadChatSession,
    isLoadingSession,
  }
}

