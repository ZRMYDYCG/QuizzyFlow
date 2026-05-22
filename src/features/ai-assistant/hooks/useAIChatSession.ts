/**
 * useAIChatSession Hook
 * 加载指定对话会话（供外部按需使用）
 */

import { useState, useCallback } from 'react'
import { message } from 'antd'
import { getChatDetail } from '@/api/modules/ai-chat'
import { Message } from '../types'
import { mapDbMessageToLocal } from '../utils/message-actions'

export const useAIChatSession = () => {
  const [isLoadingSession, setIsLoadingSession] = useState(false)

  const loadChatSession = useCallback(
    async (chatId: string): Promise<{ messages: Message[]; sessionId: string } | null> => {
      setIsLoadingSession(true)
      try {
        const chatData = (await getChatDetail(chatId)) as {
          _id?: string
          messages?: Message[]
        }

        if (!chatData?._id || !chatData.messages) {
          message.error('对话数据格式错误')
          return null
        }

        const loadedMessages = chatData.messages.map(mapDbMessageToLocal)

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
    [],
  )

  return {
    loadChatSession,
    isLoadingSession,
  }
}
