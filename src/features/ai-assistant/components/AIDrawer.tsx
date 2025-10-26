/**
 * AIDrawer Component
 * AI 助手侧边栏（用于编辑器页面）- 支持对话历史
 */

import React, { useState, useCallback } from 'react'
import { Drawer, Button, Badge, Divider, Tabs, Spin } from 'antd'
import { CloseOutlined, MessageOutlined, HistoryOutlined } from '@ant-design/icons'
import { Sparkles } from 'lucide-react'
import ChatWindow from './ChatWindow'
import ChatInput from './ChatInput'
import QuickActions from './QuickActions'
import ChatHistory from './ChatHistory'
import { useAIChat } from '../hooks/useAIChat'
import { useAIContext } from '../hooks/useAIContext'
import { useAIActions } from '../hooks/useAIActions'
import { useAIChatSession } from '../hooks/useAIChatSession'
import { AIAction, Message } from '../types'

interface AIDrawerProps {
  open: boolean
  onClose: () => void
  questionId?: string
}

const AIDrawer: React.FC<AIDrawerProps> = ({ open, onClose, questionId }) => {
  const [activeTab, setActiveTab] = useState<string>('chat')

  // 获取 AI 上下文
  const context = useAIContext({ questionId })

  // AI 操作执行
  const { executeAction, isExecuting } = useAIActions()

  // 对话会话管理
  const { loadChatSession, isLoadingSession } = useAIChatSession()

  // AI 对话（启用自动加载和自动保存）
  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    stopStreaming,
    chatSessionId,
    isLoadingHistory,
    loadLatestChat,
    createNewSession,
    setMessagesFromHistory,
  } = useAIChat({
    context,
    autoSave: true,
    autoLoad: true,
    onActionReceived: (actions) => {
      console.log('Received actions:', actions)
    },
  })

  // 处理发送消息
  const handleSend = useCallback(
    (message: string) => {
      sendMessage(message)
    },
    [sendMessage]
  )

  // 处理快捷操作
  const handleQuickAction = useCallback(
    (prompt: string) => {
      sendMessage(prompt)
    },
    [sendMessage]
  )

  // 处理执行 AI 操作
  const handleExecuteAction = useCallback(
    async (action: AIAction) => {
      const success = await executeAction(action)
      if (success) {
        console.log('Action executed successfully')
      }
    },
    [executeAction]
  )

  // 加载指定对话（从历史列表）
  const handleSelectChat = useCallback(
    async (chatId: string) => {
      const sessionData = await loadChatSession(chatId)
      if (sessionData) {
        // 设置加载的消息到当前对话
        setMessagesFromHistory(sessionData.messages, sessionData.sessionId)
        // 切换到对话标签页
        setActiveTab('chat')
        console.log('✅ 已切换到对话:', chatId, '共', sessionData.messages.length, '条消息')
      }
    },
    [loadChatSession, setMessagesFromHistory]
  )

  // 创建新对话
  const handleCreateNew = useCallback(async () => {
    clearMessages()
    await createNewSession()
    setActiveTab('chat')
  }, [clearMessages, createNewSession])

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span>AI 助手</span>
          </div>
        </div>
      }
      width={520}
      placement="right"
      open={open}
      onClose={onClose}
      closeIcon={<CloseOutlined />}
      bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* 加载历史记录时的提示 */}
      {isLoadingHistory && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 z-50 flex items-center justify-center">
          <Spin tip="加载对话历史中..." size="large" />
        </div>
      )}

      {/* Tabs 切换 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="px-4 pt-2"
        items={[
          {
            key: 'chat',
            label: (
              <span className="flex items-center gap-1">
                <MessageOutlined />
                对话
              </span>
            ),
          },
          {
            key: 'history',
            label: (
              <span className="flex items-center gap-1">
                <HistoryOutlined />
                历史
              </span>
            ),
          },
        ]}
      />

      {/* 对话标签页 */}
      {activeTab === 'chat' && (
        <>
          {/* 上下文指示器 */}
          <div className="px-4 pb-4">


            {/* 快捷操作 */}
            <QuickActions onActionClick={handleQuickAction} disabled={isLoading} />
          </div>

          <Divider className="my-0" />

          {/* 聊天窗口 */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {isLoadingSession ? (
              <div className="flex items-center justify-center h-full">
                <Spin tip="加载对话中..." />
              </div>
            ) : (
              <ChatWindow
                messages={messages}
                onExecuteAction={handleExecuteAction}
                isExecuting={isExecuting}
              />
            )}
          </div>

          <Divider className="my-0" />

          {/* 输入框 */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900">
            <ChatInput
              onSend={handleSend}
              onStop={stopStreaming}
              isLoading={isLoading}
              placeholder="输入您的问题，按 Enter 发送..."
            />
          </div>
        </>
      )}

      {/* 历史记录标签页 */}
      {activeTab === 'history' && (
        <div className="flex-1 overflow-auto p-4">
          <ChatHistory
            questionId={questionId || ''}
            currentChatId={chatSessionId}
            onSelectChat={handleSelectChat}
            onCreateNew={handleCreateNew}
          />
        </div>
      )}
    </Drawer>
  )
}

export default AIDrawer

