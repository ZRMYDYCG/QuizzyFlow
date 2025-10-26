/**
 * ChatHistory Component
 * 对话历史列表
 */

import React, { useState, useEffect } from 'react'
import { List, Button, Empty, Spin, Modal, message as antdMessage } from 'antd'
import {
  DeleteOutlined,
  MessageOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { Clock, Trash2 } from 'lucide-react'
import { getChatsByQuestion, deleteChat, type ChatSession } from '@/api/modules/ai-chat'

interface ChatHistoryProps {
  questionId: string
  currentChatId?: string | null
  onSelectChat: (chatId: string) => void
  onCreateNew: () => void
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  questionId,
  currentChatId,
  onSelectChat,
  onCreateNew,
}) => {
  const [chats, setChats] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  // 加载对话列表
  const loadChats = async () => {
    if (!questionId) return

    setLoading(true)
    try {
      const response: any = await getChatsByQuestion(questionId, { page, pageSize: 10 })
      setChats(response.list || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error('加载对话历史失败:', error)
      antdMessage.error('加载失败')
    } finally {
      setLoading(false)
    }
  }

  // 删除对话
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    Modal.confirm({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除这个对话吗？',
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteChat(id)
          antdMessage.success('删除成功')
          loadChats() // 重新加载列表
        } catch (error) {
          console.error('删除失败:', error)
          antdMessage.error('删除失败')
        }
      },
    })
  }

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 7) return `${diffDays}天前`

    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 加载数据
  useEffect(() => {
    loadChats()
  }, [questionId, page])

  if (loading && chats.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spin tip="加载中..." />
      </div>
    )
  }

  return (
    <div className="chat-history">
      {/* 头部操作 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">对话历史</h3>
        <div className="flex gap-2">
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            onClick={loadChats}
            loading={loading}
          />
          <Button type="primary" size="small" icon={<PlusOutlined />} onClick={onCreateNew}>
            新对话
          </Button>
        </div>
      </div>

      {/* 对话列表 */}
      {chats.length === 0 ? (
        <Empty
          image={<MessageOutlined className="text-4xl text-gray-300" />}
          description="暂无对话历史"
          className="py-8"
        >
          <Button type="primary" size="small" icon={<PlusOutlined />} onClick={onCreateNew}>
            开始新对话
          </Button>
        </Empty>
      ) : (
        <List
          dataSource={chats}
          renderItem={(chat) => (
            <List.Item
              key={chat._id}
              className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded transition-colors ${
                currentChatId === chat._id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : ''
              }`}
              onClick={() => onSelectChat(chat._id)}
              actions={[
                <Button
                  key="delete"
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => handleDelete(chat._id, e)}
                />,
              ]}
            >
              <List.Item.Meta
                title={
                  <div className="flex items-center gap-2">
                    <MessageOutlined className="text-gray-400" />
                    <span className="text-sm font-medium truncate">{chat.title}</span>
                  </div>
                }
                description={
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(chat.lastMessageAt)}</span>
                    <span className="mx-1">•</span>
                    <span>{chat.messages?.length || 0} 条消息</span>
                  </div>
                }
              />
            </List.Item>
          )}
          pagination={
            total > 10
              ? {
                  current: page,
                  pageSize: 10,
                  total,
                  size: 'small',
                  onChange: setPage,
                }
              : false
          }
        />
      )}
    </div>
  )
}

export default ChatHistory

