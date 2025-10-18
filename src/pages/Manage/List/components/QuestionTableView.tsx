import { FC, useState } from 'react'
import { Edit, BarChart3, Copy, Trash2, Star } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { updateQuestion, duplicateQuestion } from '@/api/modules/question'
import { useRequest } from 'ahooks'
import { message, Modal } from 'antd'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

const { confirm } = Modal

interface QuestionTableViewProps {
  questions: any[]
}

interface QuestionTableRowProps {
  question: any
  isSelected: boolean
  onSelect: (id: string) => void
}

const QuestionTableRow: FC<QuestionTableRowProps> = ({ question, isSelected, onSelect }) => {
  const { _id, answerCount, isPublish, isStar, createdAt, title } = question
  const navigate = useNavigate()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { loading: duplicateLoading, run: duplicate } = useRequest(
    async () => {
      return await duplicateQuestion(_id)
    },
    {
      manual: true,
      onSuccess: async (res: any) => {
        await message.success('复制成功')
        navigate(`/question/edit/${res._id}`)
      },
    }
  )

  const [isStarState, setIsStarState] = useState(isStar)
  const { run: changeStar, loading: changeStarLoading } = useRequest(
    async () => {
      await updateQuestion(_id, { isStar: !isStarState })
    },
    {
      manual: true,
      onSuccess: async () => {
        setIsStarState(!isStarState)
        await message.success('已更新')
      },
    }
  )

  const { loading: deleteLoading, run: del } = useRequest(
    async () => {
      await updateQuestion(_id, { isDelete: true })
    },
    {
      manual: true,
      onSuccess: async () => {
        await message.success('删除成功')
        setShowDeleteDialog(false)
      },
    }
  )

  return (
    <tr className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors group">
      <td className="p-4">
        <Checkbox.Root
          checked={isSelected}
          onCheckedChange={() => onSelect(_id)}
          className="w-5 h-5 rounded bg-slate-700/50 border border-slate-600 hover:border-blue-500 transition-colors data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
        >
          <Checkbox.Indicator>
            <Check className="w-4 h-4 text-white" />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </td>
      <td className="p-4">
        <button
          onClick={changeStar}
          disabled={changeStarLoading}
          className="transition-all disabled:opacity-50"
        >
          <Star
            className="w-4 h-4"
            fill={isStarState ? '#facc15' : 'none'}
            stroke={isStarState ? '#facc15' : '#64748b'}
          />
        </button>
      </td>
      <td className="p-4">
        <div className="flex flex-col gap-1">
          <Link
            to={isPublish ? `/question/static/${_id}` : `/question/edit/${_id}`}
            className="text-slate-200 font-medium hover:text-blue-400 transition-colors"
          >
            {title}
          </Link>
          <span className="text-xs text-slate-500">ID: {_id.slice(-6)}</span>
        </div>
      </td>
      <td className="p-4">
        <span className="text-xs font-medium text-rose-400 bg-rose-500/10 rounded px-2 py-1 border border-rose-500/20">
          考试
        </span>
      </td>
      <td className="p-4">
        {isPublish ? (
          <span className="px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20">
            已发布
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-medium text-slate-400 bg-slate-700/30 rounded border border-slate-600/30">
            未发布
          </span>
        )}
      </td>
      <td className="p-4 text-slate-300">{answerCount}</td>
      <td className="p-4 text-slate-400 text-sm">{createdAt}</td>
      <td className="p-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => navigate(`/question/edit/${_id}`)}
            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all"
            title="编辑"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            disabled={!isPublish}
            onClick={() => navigate(`/question/star/${_id}`)}
            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="统计"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              confirm({
                title: '确认复制该问卷？',
                content: '将创建一个完全相同的问卷副本',
                onOk: duplicate,
              })
            }}
            disabled={duplicateLoading}
            className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded transition-all disabled:opacity-50"
            title="复制"
          >
            <Copy className="w-4 h-4" />
          </button>

          <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialog.Trigger asChild>
              <button 
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                title="删除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in-0" />
              <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md z-50 animate-in fade-in-0 zoom-in-95 shadow-2xl">
                <AlertDialog.Title className="text-lg font-semibold text-slate-200 mb-2">
                  确认删除该问卷？
                </AlertDialog.Title>
                <AlertDialog.Description className="text-sm text-slate-400 mb-6">
                  删除后将移至回收站，您可以在回收站中恢复或彻底删除。
                </AlertDialog.Description>
                <div className="flex gap-3 justify-end">
                  <AlertDialog.Cancel asChild>
                    <button className="px-4 py-2 text-sm text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                      取消
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      onClick={del}
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
        </div>
      </td>
    </tr>
  )
}

// 移动端简化卡片视图
const MobileQuestionCard: FC<{ question: any; isSelected: boolean; onSelect: (id: string) => void }> = ({ question, isSelected, onSelect }) => {
  const { _id, answerCount, isPublish, isStar, createdAt, title } = question
  const navigate = useNavigate()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { loading: duplicateLoading, run: duplicate } = useRequest(
    async () => {
      return await duplicateQuestion(_id)
    },
    {
      manual: true,
      onSuccess: async (res: any) => {
        await message.success('复制成功')
        navigate(`/question/edit/${res._id}`)
      },
    }
  )

  const [isStarState, setIsStarState] = useState(isStar)
  const { run: changeStar, loading: changeStarLoading } = useRequest(
    async () => {
      await updateQuestion(_id, { isStar: !isStarState })
    },
    {
      manual: true,
      onSuccess: async () => {
        setIsStarState(!isStarState)
        await message.success('已更新')
      },
    }
  )

  const { loading: deleteLoading, run: del } = useRequest(
    async () => {
      await updateQuestion(_id, { isDelete: true })
    },
    {
      manual: true,
      onSuccess: async () => {
        await message.success('删除成功')
        setShowDeleteDialog(false)
      },
    }
  )

  return (
    <div className="p-3 rounded-lg bg-slate-800/20 border border-slate-700/30">
      <div className="flex items-start gap-3 mb-3">
        <Checkbox.Root
          checked={isSelected}
          onCheckedChange={() => onSelect(_id)}
          className="mt-0.5 w-5 h-5 rounded bg-slate-700/50 border border-slate-600 hover:border-blue-500 transition-colors data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
        >
          <Checkbox.Indicator>
            <Check className="w-4 h-4 text-white" />
          </Checkbox.Indicator>
        </Checkbox.Root>

        <button
          onClick={changeStar}
          disabled={changeStarLoading}
          className="mt-0.5 transition-all disabled:opacity-50"
        >
          <Star
            className="w-4 h-4"
            fill={isStarState ? '#facc15' : 'none'}
            stroke={isStarState ? '#facc15' : '#64748b'}
          />
        </button>

        <div className="flex-1 min-w-0">
          <Link
            to={isPublish ? `/question/static/${_id}` : `/question/edit/${_id}`}
            className="text-sm font-medium text-slate-200 hover:text-blue-400 transition-colors line-clamp-2 block mb-2"
          >
            {title}
          </Link>
          
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs font-medium text-rose-400 bg-rose-500/10 rounded px-2 py-0.5 border border-rose-500/20">
              考试
            </span>
            {isPublish ? (
              <span className="px-2 py-0.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20">
                已发布
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs font-medium text-slate-400 bg-slate-700/30 rounded border border-slate-600/30">
                未发布
              </span>
            )}
            <span className="text-xs text-slate-500">{answerCount} 答卷</span>
          </div>

          <div className="text-xs text-slate-500">{createdAt}</div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-700/30">
        <button
          onClick={() => navigate(`/question/edit/${_id}`)}
          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all"
          title="编辑"
        >
          <Edit className="w-4 h-4" />
        </button>

        <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialog.Trigger asChild>
            <button 
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
              title="删除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in-0" />
            <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md z-50 animate-in fade-in-0 zoom-in-95 shadow-2xl">
              <AlertDialog.Title className="text-lg font-semibold text-slate-200 mb-2">
                确认删除该问卷？
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm text-slate-400 mb-6">
                删除后将移至回收站，您可以在回收站中恢复或彻底删除。
              </AlertDialog.Description>
              <div className="flex gap-3 justify-end">
                <AlertDialog.Cancel asChild>
                  <button className="px-4 py-2 text-sm text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                    取消
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    onClick={del}
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
      </div>
    </div>
  )
}

const QuestionTableView: FC<QuestionTableViewProps> = ({ questions }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedIds.length === questions.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(questions.map((q: any) => q._id))
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
    <>
      {/* 移动端：简化卡片视图 */}
      <div className="md:hidden space-y-2">
        {questions.map((question: any) => (
          <MobileQuestionCard
            key={question._id}
            question={question}
            isSelected={selectedIds.includes(question._id)}
            onSelect={toggleSelect}
          />
        ))}
        {selectedIds.length > 0 && (
          <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <span className="text-sm text-slate-400">
              已选择 <span className="font-medium text-blue-400">{selectedIds.length}</span> 项
            </span>
          </div>
        )}
      </div>

      {/* 桌面端：完整表格视图 */}
      <div className="hidden md:block rounded-xl bg-slate-800/30 border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700/50">
              <tr>
                <th className="p-4 text-left w-12">
                  <Checkbox.Root
                    checked={selectedIds.length === questions.length && questions.length > 0}
                    onCheckedChange={toggleSelectAll}
                    className="w-5 h-5 rounded bg-slate-700/50 border border-slate-600 hover:border-blue-500 transition-colors data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  >
                    <Checkbox.Indicator>
                      <Check className="w-4 h-4 text-white" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                </th>
                <th className="p-4 text-left w-12">
                  <Star className="w-4 h-4 text-slate-500" />
                </th>
                <th className="p-4 text-left text-sm font-medium text-slate-400">标题</th>
                <th className="p-4 text-left text-sm font-medium text-slate-400">类型</th>
                <th className="p-4 text-left text-sm font-medium text-slate-400">状态</th>
                <th className="p-4 text-left text-sm font-medium text-slate-400">答卷数</th>
                <th className="p-4 text-left text-sm font-medium text-slate-400">创建时间</th>
                <th className="p-4 text-left text-sm font-medium text-slate-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question: any) => (
                <QuestionTableRow
                  key={question._id}
                  question={question}
                  isSelected={selectedIds.includes(question._id)}
                  onSelect={toggleSelect}
                />
              ))}
            </tbody>
          </table>
        </div>
        {selectedIds.length > 0 && (
          <div className="p-4 bg-slate-800/50 border-t border-slate-700/50">
            <span className="text-sm text-slate-400">
              已选择 <span className="font-medium text-blue-400">{selectedIds.length}</span> 项
            </span>
          </div>
        )}
      </div>
    </>
  )
}

export default QuestionTableView

