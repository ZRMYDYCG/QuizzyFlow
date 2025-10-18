import React from 'react'
import { useTitle } from 'ahooks'
import { useState } from 'react'
import ListSearch from '@/components/list-search'
import useLoadQuestionListData from '@/hooks/useLoadQuestionListData'
import ListPage from '@/components/list-page.tsx'
import { updateQuestion } from '@/api/modules/question'
import { useRequest } from 'ahooks'
import { deleteQuestion } from '@/api/modules/question'
import { Loader2, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { message } from 'antd'

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

  const { run: restore, loading: restoreLoading } = useRequest(
    async () => {
      for await (const id of selectedIds) {
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

  const { run: deleteQuestions, loading: deleteLoading } = useRequest(
    async () => {
      return await deleteQuestion(selectedIds)
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

  const toggleSelectAll = () => {
    if (selectedIds.length === list.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(list.map((q: any) => q._id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  return (
    <div className="min-h-full">
      {/* 头部 */}
      <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-200">回收站</h2>
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-slate-400 text-sm">
              已删除的问卷，可恢复或彻底删除 · 共 {total} 个
            </p>
          </div>
          <div>
            <ListSearch />
          </div>
        </div>
      </div>

      {/* 主体 */}
      <div className="min-h-[400px]">
        {loading && (
          <div className="flex items-center justify-center gap-2 text-slate-400 py-20">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>加载中...</span>
          </div>
        )}
        {!loading && list.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Trash2 className="w-20 h-20 mb-4 text-slate-600" />
            <p className="text-lg font-medium">回收站为空</p>
            <p className="text-sm text-slate-600 mt-1">删除的问卷会暂存在这里</p>
          </div>
        )}
        {list.length > 0 && (
          <>
            {/* 操作栏 */}
            <div className="mb-4 flex items-center gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <button
                onClick={restore}
                disabled={selectedIds.length === 0 || restoreLoading}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>恢复选中</span>
              </button>

              <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialog.Trigger asChild>
                  <button
                    disabled={selectedIds.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>彻底删除</span>
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
                          onClick={deleteQuestions}
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
                <span className="text-sm text-slate-400 ml-2">
                  已选择 <span className="font-medium text-blue-400">{selectedIds.length}</span> 项
                </span>
              )}
            </div>

            {/* 表格 */}
            <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-slate-700/50">
                  <tr>
                    <th className="p-4 text-left">
                      <Checkbox.Root
                        checked={selectedIds.length === list.length}
                        onCheckedChange={toggleSelectAll}
                        className="w-5 h-5 rounded bg-slate-700/50 border border-slate-600 hover:border-blue-500 transition-colors data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      >
                        <Checkbox.Indicator>
                          <Check className="w-4 h-4 text-white" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-slate-400">标题</th>
                    <th className="p-4 text-left text-sm font-medium text-slate-400">状态</th>
                    <th className="p-4 text-left text-sm font-medium text-slate-400">答卷数</th>
                    <th className="p-4 text-left text-sm font-medium text-slate-400">创建时间</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((question: any) => (
                    <tr
                      key={question._id}
                      className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <Checkbox.Root
                          checked={selectedIds.includes(question._id)}
                          onCheckedChange={() => toggleSelect(question._id)}
                          className="w-5 h-5 rounded bg-slate-700/50 border border-slate-600 hover:border-blue-500 transition-colors data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        >
                          <Checkbox.Indicator>
                            <Check className="w-4 h-4 text-white" />
                          </Checkbox.Indicator>
                        </Checkbox.Root>
                      </td>
                      <td className="p-4 text-slate-200 font-medium">{question.title}</td>
                      <td className="p-4">
                        {question.isPublish ? (
                          <span className="px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            已发布
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium text-slate-400 bg-slate-700/30 rounded-lg border border-slate-600/30">
                            未发布
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-300">{question.answerCount}</td>
                      <td className="p-4 text-slate-400 text-sm">{question.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* 分页 */}
      {list.length > 0 && (
        <div className="flex justify-center py-6">
          <ListPage total={total} />
        </div>
      )}
    </div>
  )
}

export default Trash
