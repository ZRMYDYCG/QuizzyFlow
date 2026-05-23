import React, { useMemo, useState } from 'react'
import { useTitle, useRequest } from 'ahooks'
import useLoadQuestionListData from '@/hooks/useLoadQuestionListData'
import QuestionListPagination from '@/pages/manage/list/components/QuestionListPagination'
import { restoreQuestion, permanentDeleteQuestion } from '@/api/modules/question'
import { message } from '@/utils/app-message'
import { Loader2, Trash2, Calendar, TrendingUp, FileText, RefreshCw } from 'lucide-react'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { useManageTheme } from '@/hooks/useManageTheme'
import { cn } from '@/utils'
import TrashStatCard from './components/TrashStatCard'
import TrashListItem from './components/TrashListItem'

const Trash: React.FC = () => {
  useTitle('回收站')
  const t = useManageTheme()

  const {
    list,
    total,
    loading,
    refresh,
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  } = useLoadQuestionListData({ isDeleted: true })

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const stats = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0)
    const weekAgo = today - 7 * 24 * 60 * 60 * 1000

    return {
      total,
      today: list.filter((q: any) => q.deletedAt && new Date(q.deletedAt).getTime() >= today)
        .length,
      thisWeek: list.filter(
        (q: any) => q.deletedAt && new Date(q.deletedAt).getTime() >= weekAgo
      ).length,
      draft: list.filter((q: any) => !q.isPublished).length,
    }
  }, [list, total])

  const { run: restore, loading: restoreLoading } = useRequest(
    async (ids: string[]) => {
      for (const id of ids) {
        await restoreQuestion(id)
      }
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('恢复成功')
        refresh()
        setSelectedIds([])
      },
    }
  )

  const { run: deleteQuestions, loading: deleteLoading } = useRequest(
    async (ids: string[]) => {
      for (const id of ids) {
        await permanentDeleteQuestion(id)
      }
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('永久删除成功')
        refresh()
        setSelectedIds([])
        setShowDeleteDialog(false)
      },
    }
  )

  const toggleSelectAll = () => {
    if (selectedIds.length === list.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(list.map((q: any) => q._id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-full space-y-6">
      {loading && list.length === 0 ? (
        <div className={cn('flex items-center justify-center gap-2 py-20', t.text.secondary)}>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>加载中...</span>
        </div>
      ) : null}

      {!loading && total === 0 ? (
        <div className={cn('flex flex-col items-center justify-center py-20', t.text.secondary)}>
          <Trash2 className={cn('w-16 h-16 mb-4', t.text.tertiary)} />
          <p className="text-lg font-medium">回收站为空</p>
          <p className={cn('text-sm mt-1', t.text.tertiary)}>删除的问卷会暂存在这里</p>
        </div>
      ) : null}

      {total > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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
              subtitle="本页统计"
            />
            <TrashStatCard
              title="本周删除"
              value={stats.thisWeek}
              icon={TrendingUp}
              color="text-purple-400"
              subtitle="本页统计"
            />
            <TrashStatCard
              title="草稿"
              value={stats.draft}
              icon={FileText}
              color="text-amber-400"
              subtitle="本页统计"
            />
          </div>

          <div
            className={cn(
              'flex flex-wrap items-center gap-3 p-3 md:p-4 rounded-lg border',
              t.isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-200 shadow-sm'
            )}
          >
            <Checkbox.Root
              checked={selectedIds.length === list.length && list.length > 0}
              onCheckedChange={toggleSelectAll}
              className={cn(
                'w-5 h-5 rounded border data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500',
                t.isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-300'
              )}
            >
              <Checkbox.Indicator>
                <Check className="w-4 h-4 text-white" />
              </Checkbox.Indicator>
            </Checkbox.Root>

            <button
              type="button"
              onClick={() => restore(selectedIds)}
              disabled={selectedIds.length === 0 || restoreLoading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-4 h-4" />
              恢复选中
            </button>

            <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialog.Trigger asChild>
                <button
                  type="button"
                  disabled={selectedIds.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-red-500 hover:bg-red-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  彻底删除
                </button>
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                <AlertDialog.Content
                  className={cn(
                    'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 w-full max-w-md z-50 shadow-xl border',
                    t.dialog.bg,
                    t.dialog.border
                  )}
                >
                  <AlertDialog.Title className={cn('text-lg font-semibold mb-2', t.dialog.title)}>
                    确认彻底删除？
                  </AlertDialog.Title>
                  <AlertDialog.Description className={cn('text-sm mb-6', t.dialog.description)}>
                    删除后将无法恢复，您将删除 {selectedIds.length} 个问卷。
                  </AlertDialog.Description>
                  <div className="flex gap-3 justify-end">
                    <AlertDialog.Cancel asChild>
                      <button type="button" className={cn('px-4 py-2 text-sm rounded-md', t.button.default)}>
                        取消
                      </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <button
                        type="button"
                        onClick={() => deleteQuestions(selectedIds)}
                        disabled={deleteLoading}
                        className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md disabled:opacity-50"
                      >
                        确认删除
                      </button>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>

            {selectedIds.length > 0 ? (
              <span className={cn('text-sm', t.text.secondary)}>
                已选择 {selectedIds.length} 项
              </span>
            ) : null}
          </div>

          <div className="space-y-2">
            {list.map((question: any) => (
              <TrashListItem
                key={question._id}
                question={question}
                isSelected={selectedIds.includes(question._id)}
                onSelect={() => toggleSelect(question._id)}
                onRestore={() => restore([question._id])}
                onDelete={() => deleteQuestions([question._id])}
              />
            ))}
          </div>

          <QuestionListPagination
            total={total}
            page={page}
            pageSize={pageSize}
            onChange={handlePageChange}
            onShowSizeChange={handlePageSizeChange}
          />
        </>
      ) : null}
    </div>
  )
}

export default Trash
