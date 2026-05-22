/**
 * AI 对话面板核心内容（供侧边栏 / Drawer 复用）
 */
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Divider, Tabs, Spin, Tooltip } from 'antd'
import { MessageOutlined, HistoryOutlined } from '@ant-design/icons'
import { Plus } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils'
import ChatWindow from './ChatWindow'
import ChatInput from './ChatInput'
import FollowUpGuideForm from './FollowUpGuideForm'
import ChatHistory from './ChatHistory'
import { useAIChat } from '../hooks/useAIChat'
import { useAIContext } from '../hooks/useAIContext'
import { useAIActions } from '../hooks/useAIActions'
import { AIAction } from '../types'
import { getActiveFollowUpMessage } from '../utils/follow-up'

interface AIChatPanelProps {
  questionId?: string
  initialMessage?: string
  onInitialMessageSent?: () => void
  className?: string
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({
  questionId,
  initialMessage,
  onInitialMessageSent,
  className,
}) => {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<string>('chat')
  const [executingActionId, setExecutingActionId] = useState<string | null>(null)
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)
  const initialMessageSentRef = useRef(false)

  const context = useAIContext({ questionId })
  const { executeAction, isExecuting } = useAIActions()

  const {
    messages,
    isLoading,
    sendMessage,
    stopStreaming,
    chatSessionId,
    isLoadingHistory,
    isSwitchingSession,
    createNewSession,
    switchToSession,
    markActionApplied,
    markFollowUpHandled,
  } = useAIChat({
    context,
    autoSave: true,
    autoLoad: true,
  })

  useEffect(() => {
    if (
      !initialMessage?.trim() ||
      initialMessageSentRef.current ||
      isLoadingHistory ||
      isLoading
    ) {
      return
    }
    initialMessageSentRef.current = true
    sendMessage(initialMessage.trim())
    onInitialMessageSent?.()
  }, [initialMessage, isLoadingHistory, isLoading, sendMessage, onInitialMessageSent])

  const handleSend = useCallback(
    async (message: string) => {
      const activeFollowUp = getActiveFollowUpMessage(messages, isLoading)
      if (activeFollowUp?.followUpActionId) {
        await markFollowUpHandled(activeFollowUp.id, activeFollowUp.followUpActionId)
      }
      await sendMessage(message)
    },
    [messages, isLoading, markFollowUpHandled, sendMessage],
  )

  const activeFollowUp = getActiveFollowUpMessage(messages, isLoading)

  const handleFollowUpSubmit = useCallback(
    async (message: string) => {
      if (!activeFollowUp?.followUpActionId) return
      await markFollowUpHandled(activeFollowUp.id, activeFollowUp.followUpActionId)
      await sendMessage(message)
    },
    [activeFollowUp, markFollowUpHandled, sendMessage],
  )

  const handleFollowUpDismiss = useCallback(async () => {
    if (!activeFollowUp?.followUpActionId) return
    await markFollowUpHandled(activeFollowUp.id, activeFollowUp.followUpActionId)
  }, [activeFollowUp, markFollowUpHandled])

  const handleExecuteAction = useCallback(
    async (messageId: string, action: AIAction) => {
      if (!action.id) return
      setExecutingActionId(action.id)
      try {
        const success = await executeAction(action)
        if (success) {
          await markActionApplied(messageId, action.id)
        }
      } finally {
        setExecutingActionId(null)
      }
    },
    [executeAction, markActionApplied]
  )

  const handleSelectChat = useCallback(
    async (chatId: string) => {
      stopStreaming()
      const ok = await switchToSession(chatId)
      if (ok) {
        setActiveTab('chat')
      }
    },
    [stopStreaming, switchToSession]
  )

  const handleCreateNew = useCallback(async () => {
    stopStreaming()
    await createNewSession()
    setActiveTab('chat')
    setHistoryRefreshKey((key) => key + 1)
  }, [stopStreaming, createNewSession])

  const handleDeleteChat = useCallback(
    async (deletedId: string) => {
      if (deletedId !== chatSessionId) return
      stopStreaming()
      await createNewSession()
      setActiveTab('chat')
      setHistoryRefreshKey((key) => key + 1)
    },
    [chatSessionId, stopStreaming, createNewSession]
  )

  return (
    <div className={`flex h-full flex-col ${className ?? ''}`}>
      {isLoadingHistory && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
          <Spin tip="加载对话历史中..." size="large" />
        </div>
      )}

      <div className="flex shrink-0 items-center gap-1 px-2 pt-1">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="min-w-0 flex-1 [&_.ant-tabs-nav]:mb-0"
          size="small"
          items={[
            {
              key: 'chat',
              label: (
                <Tooltip title="对话">
                  <MessageOutlined className="text-base" />
                </Tooltip>
              ),
            },
            {
              key: 'history',
              label: (
                <Tooltip title="历史">
                  <HistoryOutlined className="text-base" />
                </Tooltip>
              ),
            },
          ]}
        />
        <Tooltip title="新对话">
          <button
            type="button"
            onClick={handleCreateNew}
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
              theme === 'dark'
                ? 'text-gray-400 hover:bg-white/10 hover:text-gray-200'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            )}
          >
            <Plus className="h-4 w-4" />
          </button>
        </Tooltip>
      </div>

      {activeTab === 'chat' && (
        <>
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {isSwitchingSession ? (
              <div className="flex h-full items-center justify-center">
                <Spin tip="加载对话中..." />
              </div>
            ) : (
              <ChatWindow
                messages={messages}
                onExecuteAction={handleExecuteAction}
                isExecuting={isExecuting}
                executingActionId={executingActionId}
              />
            )}
          </div>

          <Divider className="my-0" />

          <div className="shrink-0 p-3">
            {activeFollowUp?.followUp && (
              <FollowUpGuideForm
                guide={activeFollowUp.followUp}
                onSubmit={handleFollowUpSubmit}
                onDismiss={handleFollowUpDismiss}
                disabled={isLoading}
              />
            )}
            <ChatInput
              onSend={handleSend}
              onStop={stopStreaming}
              isLoading={isLoading}
              placeholder="输入消息..."
            />
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <div className="min-h-0 flex-1 overflow-auto p-3">
          <ChatHistory
            questionId={questionId || ''}
            currentChatId={chatSessionId}
            refreshKey={historyRefreshKey}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
          />
        </div>
      )}
    </div>
  )
}

export default AIChatPanel
