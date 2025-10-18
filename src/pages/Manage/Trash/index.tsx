import React, { useState, useMemo } from 'react'
import { useTitle } from 'ahooks'
import useLoadQuestionListData from '@/hooks/useLoadQuestionListData'
import { updateQuestion, deleteQuestion } from '@/api/modules/question'
import { useRequest } from 'ahooks'
import { message } from 'antd'
import { 
  Loader2, 
  Trash2, 
  Calendar, 
  TrendingUp, 
  Database, 
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

// 组件导入
import TrashStatCard from './components/TrashStatCard'
import UrgentAlert from './components/UrgentAlert'
import SmartFilter, { FilterType } from './components/SmartFilter'
import EnhancedTrashItem from './components/EnhancedTrashItem'
import SmartSuggestions from './components/SmartSuggestions'

const AUTO_DELETE_DAYS = 30

const Trash: React.FC = () => {
  useTitle('回收站')

  const {
    data = {},
    loading,
    refresh,
  } = useLoadQuestionListData({ isDeleted: true })
  const { list = [], total = 0 } = data

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all')

  // 计算统计数据
  const stats = useMemo(() => {
    const now = new Date().getTime()
    const today = new Date().setHours(0, 0, 0, 0)
    const weekAgo = today - 7 * 24 * 60 * 60 * 1000

    return {
      total: list.length,
      today: list.filter((q: any) => {
        if (!q.deletedAt) return false
        return new Date(q.deletedAt).getTime() >= today
      }).length,
      thisWeek: list.filter((q: any) => {
        if (!q.deletedAt) return false
        return new Date(q.deletedAt).getTime() >= weekAgo
      }).length,
      highValue: list.filter((q: any) => (q.answerCount || 0) >= 50).length,
      urgent: list.filter((q: any) => {
        if (!q.deletedAt) return false
        const daysAgo = Math.floor((now - new Date(q.deletedAt).getTime()) / (1000 * 60 * 60 * 24))
        return daysAgo >= AUTO_DELETE_DAYS - 3
      }).length,
      draft: list.filter((q: any) => !q.isPublish).length,
      published: list.filter((q: any) => q.isPublish).length,
    }
  }, [list])

  // 筛选列表
  const filteredList = useMemo(() => {
    const now = new Date().getTime()
    
    switch (currentFilter) {
      case 'high-value':
        return list.filter((q: any) => (q.answerCount || 0) >= 50)
      case 'urgent':
        return list.filter((q: any) => {
          if (!q.deletedAt) return false
          const daysAgo = Math.floor((now - new Date(q.deletedAt).getTime()) / (1000 * 60 * 60 * 24))
          return daysAgo >= AUTO_DELETE_DAYS - 3
        })
      case 'draft':
        return list.filter((q: any) => !q.isPublish)
      case 'published':
        return list.filter((q: any) => q.isPublish)
      default:
        return list
    }
  }, [list, currentFilter])

  // 恢复操作
  const { run: restore, loading: restoreLoading } = useRequest(
    async (ids: string[]) => {
      for await (const id of ids) {
        await updateQuestion(id, { isDeleted: false })
      }
    },
    {
      manual: true,
      debounceWait: 500,
      onSuccess: async () => {
        message.success('恢复成功')
        refresh()
        setSelectedIds([])
      },
    }
  )

  // 删除操作
  const { run: deleteQuestions, loading: deleteLoading } = useRequest(
    async (ids: string[]) => {
      return await deleteQuestion(ids)
    },
    {
      manual: true,
      onSuccess: async () => {
        message.success('删除成功')
        refresh()
        setSelectedIds([])
        setShowDeleteDialog(false)
      },
    }
  )

  // 选择操作
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredList.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredList.map((q: any) => q._id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // 智能建议操作
  const handleSuggestionAction = (action: string, ids: string[]) => {
    switch (action) {
      case 'export':
        message.info('导出功能开发中...')
        break
      case 'clean-drafts':
        setSelectedIds(ids)
        setShowDeleteDialog(true)
        break
      case 'restore-urgent':
        restore(ids)
        break
      case 'review':
        setCurrentFilter('all')
        setSelectedIds(ids)
        break
      default:
        break
    }
  }

  // 恢复全部紧急问卷
  const restoreAllUrgent = () => {
    const now = new Date().getTime()
    const urgentIds = list
      .filter((q: any) => {
        if (!q.deletedAt) return false
        const daysAgo = Math.floor((now - new Date(q.deletedAt).getTime()) / (1000 * 60 * 60 * 24))
        return daysAgo >= AUTO_DELETE_DAYS - 3
      })
      .map((q: any) => q._id)
    
    if (urgentIds.length > 0) {
      restore(urgentIds)
    }
  }

  return (
    <div className="min-h-full">
      {/* 头部 */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <Trash2 className="w-7 h-7 md:w-8 md:h-8 text-red-400" />
              回收站智能管理
            </h1>
            <p className="text-slate-500 text-sm">
              已删除 {total} 个问卷 · 自动清理周期 {AUTO_DELETE_DAYS} 天
            </p>
          </div>
        </div>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex items-center justify-center gap-2 text-slate-400 py-20">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>加载中...</span>
        </div>
      )}

      {/* 空状态 */}
      {!loading && list.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Trash2 className="w-20 h-20 mb-4 text-slate-600" />
          <p className="text-lg font-medium">回收站为空</p>
          <p className="text-sm text-slate-600 mt-1">删除的问卷会暂存在这里</p>
        </div>
      )}

      {/* 内容区域 */}
      {!loading && list.length > 0 && (
        <div className="space-y-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            <TrashStatCard
              title="总计"
              value={stats.total}
              icon={Trash2}
              color="text-slate-400"
              subtitle="全部问卷"
            />
            <TrashStatCard
              title="今日删除"
              value={stats.today}
              icon={Calendar}
              color="text-blue-400"
              subtitle="最近删除"
            />
            <TrashStatCard
              title="本周删除"
              value={stats.thisWeek}
              icon={TrendingUp}
              color="text-purple-400"
              subtitle="7天内"
            />
            <TrashStatCard
              title="高价值"
              value={stats.highValue}
              icon={Database}
              color="text-yellow-400"
              subtitle="答卷≥50"
            />
            <TrashStatCard
              title="即将清理"
              value={stats.urgent}
              icon={AlertCircle}
              color="text-red-400"
              subtitle="3天内"
              isWarning={true}
            />
          </div>

          {/* 紧急提醒 */}
          {stats.urgent > 0 && (
            <UrgentAlert
              questions={list}
              onRestoreAll={restoreAllUrgent}
              autoDeleteDays={AUTO_DELETE_DAYS}
            />
          )}

          {/* 智能筛选 */}
          <SmartFilter
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            counts={{
              all: stats.total,
              highValue: stats.highValue,
              urgent: stats.urgent,
              draft: stats.draft,
              published: stats.published,
            }}
          />

          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：列表区域 */}
            <div className="lg:col-span-2 space-y-4">
              {/* 批量操作栏 */}
              <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <Checkbox.Root
                  checked={selectedIds.length === filteredList.length && filteredList.length > 0}
                  onCheckedChange={toggleSelectAll}
                  className="w-5 h-5 rounded bg-slate-700/50 border border-slate-600 hover:border-blue-500 transition-colors data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                >
                  <Checkbox.Indicator>
                    <Check className="w-4 h-4 text-white" />
                  </Checkbox.Indicator>
                </Checkbox.Root>

                <button
                  onClick={() => restore(selectedIds)}
                  disabled={selectedIds.length === 0 || restoreLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  恢复选中
                </button>

                <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialog.Trigger asChild>
                    <button
                      disabled={selectedIds.length === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      彻底删除
                    </button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Portal>
                    <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in-0" />
                    <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md z-50 animate-in fade-in-0 zoom-in-95 shadow-2xl">
                      <AlertDialog.Title className="text-lg font-semibold text-slate-200 mb-2">
                        确认彻底删除？
                      </AlertDialog.Title>
                      <AlertDialog.Description className="text-sm text-slate-400 mb-6">
                        删除后将无法恢复，请谨慎操作！您将删除 {selectedIds.length} 个问卷。
                      </AlertDialog.Description>
                      <div className="flex gap-3 justify-end">
                        <AlertDialog.Cancel asChild>
                          <button className="px-4 py-2 text-sm text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                            取消
                          </button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                          <button
                            onClick={() => deleteQuestions(selectedIds)}
                            disabled={deleteLoading}
                            className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
                          >
                            确认删除
                          </button>
                        </AlertDialog.Action>
                      </div>
                    </AlertDialog.Content>
                  </AlertDialog.Portal>
                </AlertDialog.Root>

                {selectedIds.length > 0 && (
                  <span className="text-sm text-slate-400">
                    已选择 <span className="font-medium text-blue-400">{selectedIds.length}</span> 项
                  </span>
                )}
              </div>

              {/* 问卷列表 */}
              <div className="space-y-3">
                {filteredList.map((question: any) => (
                  <EnhancedTrashItem
                    key={question._id}
                    question={question}
                    isSelected={selectedIds.includes(question._id)}
                    onSelect={() => toggleSelect(question._id)}
                    onRestore={() => restore([question._id])}
                    onDelete={() => deleteQuestions([question._id])}
                    autoDeleteDays={AUTO_DELETE_DAYS}
                  />
                ))}
              </div>

              {filteredList.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <p className="text-sm">没有符合条件的问卷</p>
                </div>
              )}
            </div>

            {/* 右侧：智能建议 */}
            <div className="lg:col-span-1">
              <SmartSuggestions questions={list} onAction={handleSuggestionAction} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Trash
