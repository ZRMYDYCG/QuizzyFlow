import { FC } from 'react'
import { Edit, BarChart3, Copy, Trash2, Star, Clock, FileText } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { updateQuestion, duplicateQuestion, deleteQuestion } from '@/api/modules/question'
import { useRequest } from 'ahooks'
import { message, Modal } from 'antd'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { useState } from 'react'
import { useManageTheme } from '@/hooks/useManageTheme'

const { confirm } = Modal

interface QuestionListViewProps {
  questions: any[]
  onDelete?: () => void // 删除成功回调
}

const QuestionListItem: FC<any> = (props) => {
  const { _id, answerCount, isPublished, isStar, createdAt, title, onDelete } = props
  const navigate = useNavigate()
  const t = useManageTheme()
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
      await deleteQuestion([_id])
    },
    {
      manual: true,
      onSuccess: async () => {
        await message.success('删除成功')
        setShowDeleteDialog(false)
        // 调用回调函数通知父组件刷新列表
        onDelete?.()
      },
    }
  )

  return (
    <div className={`group flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 rounded-lg border transition-all gap-3 sm:gap-0 ${
      t.isDark 
        ? 'bg-slate-800/20 hover:bg-slate-800/40 border-slate-700/30 hover:border-blue-500/30' 
        : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-blue-400 shadow-sm'
    }`}>
      {/* 左侧：标题和元信息 */}
      <div className="flex-1 min-w-0 sm:mr-4">
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          <button
            onClick={changeStar}
            disabled={changeStarLoading}
            className="flex-shrink-0 transition-all disabled:opacity-50"
          >
            <Star
              className="w-3.5 h-3.5 md:w-4 md:h-4"
              fill={isStarState ? '#facc15' : 'none'}
              stroke={isStarState ? '#facc15' : '#64748b'}
            />
          </button>
          
          <Link
            to={isPublished ? `/question/static/${_id}` : `/question/edit/${_id}`}
            className={`text-sm md:text-base font-medium hover:text-blue-400 transition-colors truncate flex-1 ${t.text.primary}`}
          >
            {title}
          </Link>

          <span className="flex-shrink-0 text-xs font-medium text-rose-400 bg-rose-500/10 rounded px-1.5 md:px-2 py-0.5 border border-rose-500/20">
            考试
          </span>

          {isPublished ? (
            <span className="flex-shrink-0 px-1.5 md:px-2 py-0.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20 hidden sm:inline">
              已发布
            </span>
          ) : (
            <span className="flex-shrink-0 px-1.5 md:px-2 py-0.5 text-xs font-medium text-slate-400 bg-slate-700/30 rounded border border-slate-600/30 hidden sm:inline">
              未发布
            </span>
          )}
        </div>

        <div className={`flex items-center gap-2 md:gap-4 text-xs flex-wrap ${t.text.tertiary}`}>
          <span className="flex items-center gap-1 hidden sm:flex">
            <FileText className="w-3 h-3" />
            ID: {_id.slice(-6)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {createdAt}
          </span>
          <span className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            {answerCount} 答卷
          </span>
        </div>
      </div>

      {/* 右侧：操作按钮 - 移动端始终显示，桌面端悬停显示 */}
      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity justify-end sm:justify-start">
        <button
          onClick={() => navigate(`/question/edit/${_id}`)}
          className="p-1.5 md:p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all"
          title="编辑"
        >
          <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
        
        <button
          disabled={!isPublished}
          onClick={() => navigate(`/question/star/${_id}`)}
          className="p-1.5 md:p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed hidden sm:flex"
          title="统计"
        >
          <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4" />
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
          className="p-1.5 md:p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded transition-all disabled:opacity-50 hidden sm:flex"
          title="复制"
        >
          <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>

        <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialog.Trigger asChild>
            <button 
              className="p-1.5 md:p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
              title="删除"
            >
              <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in-0" />
            <AlertDialog.Content className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${t.dialog.bg} border ${t.dialog.border} rounded-xl p-6 w-full max-w-md z-50 animate-in fade-in-0 zoom-in-95 shadow-2xl`}>
              <AlertDialog.Title className={`text-lg font-semibold ${t.dialog.title} mb-2`}>
                确认删除该问卷？
              </AlertDialog.Title>
              <AlertDialog.Description className={`text-sm ${t.dialog.description} mb-6`}>
                删除后将移至回收站，您可以在回收站中恢复或彻底删除。
              </AlertDialog.Description>
              <div className="flex gap-3 justify-end">
                <AlertDialog.Cancel asChild>
                  <button className={`px-4 py-2 text-sm ${t.button.default} rounded-lg transition-colors`}>
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

const QuestionListView: FC<QuestionListViewProps> = ({ questions, onDelete }) => {
  return (
    <div className="space-y-1.5 md:space-y-2">
      {questions.map((question: any) => (
        <QuestionListItem key={question._id} {...question} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default QuestionListView

