/**
 * ChatHistory Component
 * 对话历史列表
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Empty, Spin, Modal, Tooltip, message as antdMessage } from 'antd'
import { Pin, Trash2, Pencil } from 'lucide-react'
import { getChatsByQuestion, deleteChat, updateChat, type ChatSession } from '@/api/modules/ai-chat'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils'

interface ChatHistoryProps {
  questionId: string
  currentChatId?: string | null
  refreshKey?: number
  onSelectChat: (chatId: string) => void
  onDeleteChat?: (deletedId: string) => void
}

const getPinStorageKey = (questionId: string) => `ai-chat-pins-${questionId}`

const loadPinnedIds = (questionId: string): string[] => {
  try {
    const raw = localStorage.getItem(getPinStorageKey(questionId))
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

const savePinnedIds = (questionId: string, ids: string[]) => {
  localStorage.setItem(getPinStorageKey(questionId), JSON.stringify(ids))
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  questionId,
  currentChatId,
  refreshKey = 0,
  onSelectChat,
  onDeleteChat,
}) => {
  const { theme } = useTheme()
  const [chats, setChats] = useState<ChatSession[]>([])
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => loadPinnedIds(questionId))
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)

  const loadChats = useCallback(async () => {
    if (!questionId) return

    setLoading(true)
    try {
      const response: { list?: ChatSession[] } = await getChatsByQuestion(questionId, {
        page: 1,
        pageSize: 50,
      })
      setChats(response.list || [])
    } catch (error) {
      console.error('加载对话历史失败:', error)
      antdMessage.error('加载失败')
    } finally {
      setLoading(false)
    }
  }, [questionId])

  const sortedChats = useMemo(() => {
    const pinOrder = new Map(pinnedIds.map((id, index) => [id, index]))
    return [...chats].sort((a, b) => {
      const aPinned = pinOrder.has(a._id)
      const bPinned = pinOrder.has(b._id)
      if (aPinned && !bPinned) return -1
      if (!aPinned && bPinned) return 1
      if (aPinned && bPinned) {
        return (pinOrder.get(a._id) ?? 0) - (pinOrder.get(b._id) ?? 0)
      }
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    })
  }, [chats, pinnedIds])

  const handleDelete = (id: string, e: React.MouseEvent) => {
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
          setPinnedIds((prev) => {
            const next = prev.filter((pinId) => pinId !== id)
            savePinnedIds(questionId, next)
            return next
          })
          loadChats()
          onDeleteChat?.(id)
        } catch (error) {
          console.error('删除失败:', error)
          antdMessage.error('删除失败')
        }
      },
    })
  }

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPinnedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((pinId) => pinId !== id)
        : [id, ...prev]
      savePinnedIds(questionId, next)
      return next
    })
  }

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

    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
  }

  const getDisplayTitle = (title: string) => {
    const cleaned = title.replace(/\s*-\s*AI\s*对话\s*$/i, '').trim()
    return cleaned || '未命名'
  }

  const startEdit = (chat: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(chat._id)
    setEditingTitle(getDisplayTitle(chat.title))
    requestAnimationFrame(() => editInputRef.current?.select())
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const commitEdit = async (id: string) => {
    const title = editingTitle.trim() || '未命名'
    const current = chats.find((c) => c._id === id)
    if (!current || getDisplayTitle(current.title) === title) {
      cancelEdit()
      return
    }

    try {
      await updateChat(id, { title })
      setChats((prev) => prev.map((c) => (c._id === id ? { ...c, title } : c)))
      antdMessage.success('标题已更新')
    } catch (error) {
      console.error('更新标题失败:', error)
      antdMessage.error('更新失败')
    } finally {
      cancelEdit()
    }
  }

  useEffect(() => {
    setPinnedIds(loadPinnedIds(questionId))
    loadChats()
  }, [questionId, refreshKey, loadChats])

  if (loading && chats.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spin size="small" />
      </div>
    )
  }

  if (sortedChats.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="暂无对话历史"
        className="py-10"
      />
    )
  }

  return (
    <div className="space-y-0.5">
      {sortedChats.map((chat) => {
        const isActive = currentChatId === chat._id
        const isPinned = pinnedIds.includes(chat._id)

        return (
          <div
            key={chat._id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectChat(chat._id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSelectChat(chat._id)
            }}
            className={cn(
              'group relative flex cursor-pointer items-center overflow-hidden rounded-lg px-2 py-2.5 transition-colors',
              theme === 'dark' ? 'hover:bg-white/[0.04]' : 'hover:bg-black/[0.03]'
            )}
          >
            {isActive && (
              <span
                className={cn(
                  'absolute bottom-2 left-0 top-2 w-0.5 rounded-full',
                  theme === 'dark' ? 'bg-white/70' : 'bg-gray-900'
                )}
              />
            )}

            <div className="min-w-0 flex-1 pl-1">
              <div className="flex items-center gap-1.5">
                {isPinned && (
                  <Pin
                    className={cn(
                      'h-3 w-3 shrink-0 fill-current',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}
                  />
                )}
                {editingId === chat._id ? (
                  <input
                    ref={editInputRef}
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      e.stopPropagation()
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        void commitEdit(chat._id)
                      }
                      if (e.key === 'Escape') {
                        e.preventDefault()
                        cancelEdit()
                      }
                    }}
                    onBlur={() => void commitEdit(chat._id)}
                    className={cn(
                      'w-full rounded border bg-transparent px-1 py-0.5 text-sm outline-none',
                      theme === 'dark'
                        ? 'border-white/20 text-white focus:border-white/40'
                        : 'border-gray-300 text-gray-900 focus:border-gray-400'
                    )}
                  />
                ) : (
                  <p
                    onDoubleClick={(e) => startEdit(chat, e)}
                    className={cn(
                      'truncate text-sm',
                      isActive
                        ? theme === 'dark'
                          ? 'font-medium text-white'
                          : 'font-medium text-gray-900'
                        : theme === 'dark'
                          ? 'text-gray-300'
                          : 'text-gray-700'
                    )}
                  >
                    {getDisplayTitle(chat.title)}
                  </p>
                )}
              </div>
              <p className={cn('mt-0.5 pl-0 text-xs', theme === 'dark' ? 'text-gray-600' : 'text-gray-400')}>
                {formatTime(chat.lastMessageAt)}
              </p>
            </div>

            <div
              className={cn(
                'absolute inset-y-0 right-0 flex items-center gap-0.5 pl-6 pr-1',
                'translate-x-full transition-transform duration-200 ease-out',
                'group-hover:translate-x-0',
                theme === 'dark'
                  ? 'bg-gradient-to-l from-[#1e1e23] via-[#1e1e23]/95 to-transparent'
                  : 'bg-gradient-to-l from-white via-white/95 to-transparent'
              )}
            >
              <Tooltip title={isPinned ? '取消置顶' : '置顶'}>
                <button
                  type="button"
                  onClick={(e) => handleTogglePin(chat._id, e)}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                    theme === 'dark'
                      ? 'text-gray-400 hover:bg-white/10 hover:text-gray-200'
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                  )}
                >
                  <Pin className={cn('h-3.5 w-3.5', isPinned && 'fill-current text-gray-700 dark:text-gray-200')} />
                </button>
              </Tooltip>
              <Tooltip title="重命名">
                <button
                  type="button"
                  onClick={(e) => startEdit(chat, e)}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                    theme === 'dark'
                      ? 'text-gray-400 hover:bg-white/10 hover:text-gray-200'
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                  )}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </Tooltip>
              <Tooltip title="删除">
                <button
                  type="button"
                  onClick={(e) => handleDelete(chat._id, e)}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                    'text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10'
                  )}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </Tooltip>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ChatHistory
