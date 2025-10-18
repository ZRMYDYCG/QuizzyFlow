import { FC, useState } from 'react'
import { message, Modal } from 'antd'
import { Edit, BarChart3, Copy, Trash2, Star } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import {
  updateQuestion,
  duplicateQuestion,
} from '../../../../api/modules/question.ts'
import { useRequest } from 'ahooks'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

const { confirm } = Modal

interface QuestionCardProps {
  _id: string
  title: string
  createdAt: string
  answerCount: number
  isStar: boolean
  isPublish: boolean
}

const QuestionsCard: FC<QuestionCardProps> = (props: QuestionCardProps) => {
  const { _id, answerCount, isPublish, isStar, createdAt, title } = props
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
    <div className="mb-4 p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 backdrop-blur-sm group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={isPublish ? `/question/static/${_id}` : `/question/edit/${_id}`}
              className="text-lg font-semibold text-slate-200 hover:text-blue-400 transition-colors group-hover:text-blue-300"
            >
              {title}
            </Link>
            <span className="text-xs font-medium text-rose-400 bg-rose-500/10 rounded-lg px-2 py-1 border border-rose-500/20">
              考试
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="text-xs">ID: {_id.slice(-6)}</span>
            <span className="text-xs">{createdAt}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isPublish ? (
            <span className="px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              已发布
            </span>
          ) : (
            <span className="px-3 py-1 text-xs font-medium text-slate-400 bg-slate-700/30 rounded-lg border border-slate-600/30">
              未发布
            </span>
          )}
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <span className="text-xs text-slate-400">答卷</span>
            <span className="text-sm font-bold text-blue-400">{answerCount}</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-700/50 my-4" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/question/edit/${_id}`)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
          >
            <Edit className="w-4 h-4" />
            <span>编辑</span>
          </button>
          <button
            disabled={!isPublish}
            onClick={() => navigate(`/question/star/${_id}`)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <BarChart3 className="w-4 h-4" />
            <span>统计</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={changeStar}
            disabled={changeStarLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all disabled:opacity-50"
            style={{
              color: isStarState ? '#facc15' : '#94a3b8',
              backgroundColor: isStarState ? 'rgba(250, 204, 21, 0.1)' : 'transparent',
            }}
          >
            <Star
              className="w-4 h-4"
              fill={isStarState ? '#facc15' : 'none'}
            />
            <span>{isStarState ? '已标星' : '标星'}</span>
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
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all disabled:opacity-50"
          >
            <Copy className="w-4 h-4" />
            <span>复制</span>
          </button>

          <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialog.Trigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <Trash2 className="w-4 h-4" />
                <span>删除</span>
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
    </div>
  )
}

export default QuestionsCard
