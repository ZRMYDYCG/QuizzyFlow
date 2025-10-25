import { FC, useState } from 'react'
import { message, Modal } from 'antd'
import { Edit, BarChart3, Copy, Trash2, Star } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import {
  updateQuestion,
  duplicateQuestion,
  deleteQuestion,
} from '../../../../api/modules/question.ts'
import { useRequest } from 'ahooks'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { useManageTheme } from '@/hooks/useManageTheme'
import { useTheme } from '@/contexts/ThemeContext'
import QuestionnaireTypeTag from '@/components/questionnaire-type-tag'
import { QuestionnaireType } from '@/constants/questionnaire-types'

const { confirm } = Modal

interface QuestionCardProps {
  _id: string
  title: string
  type?: string // 问卷类型
  createdAt: string
  answerCount: number
  isStar: boolean
  isPublished: boolean
  onDelete?: () => void // 删除成功回调
}

const QuestionsCard: FC<QuestionCardProps> = (props: QuestionCardProps) => {
  const { _id, answerCount, isPublished, isStar, createdAt, title, type, onDelete } = props
  const navigate = useNavigate()
  const t = useManageTheme()
  const { primaryColor } = useTheme()
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
    <div className="relative group">
      {/* 主卡片 */}
      <div 
        className={`relative p-4 md:p-5 rounded-xl md:rounded-2xl border transition-all duration-300 overflow-hidden ${
          t.isDark 
            ? 'bg-gradient-to-br from-slate-800/80 to-slate-800/40 border-slate-700/50 backdrop-blur-sm' 
            : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
        }`}
        style={{
          borderColor: t.isDark ? '' : primaryColor + '20'
        }}
        onMouseEnter={(e) => {
          if (!t.isDark) {
            e.currentTarget.style.borderColor = primaryColor + '40'
          } else {
            e.currentTarget.style.borderColor = primaryColor + '50'
          }
        }}
        onMouseLeave={(e) => {
          if (!t.isDark) {
            e.currentTarget.style.borderColor = primaryColor + '20'
          } else {
            e.currentTarget.style.borderColor = ''
          }
        }}
      >
        {/* 背景装饰 - 仅深色模式 */}
        {t.isDark && (
          <div 
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all duration-500"
            style={{ backgroundColor: primaryColor + '05' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor + '10'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor + '05'
            }}
          />
        )}
        
        {/* 顶部：标题和标签 */}
        <div className="relative mb-3 md:mb-4">
          <div className="flex items-start justify-between gap-3 md:gap-4 mb-3">
            {/* 左侧：标星 + 标题 */}
            <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
              <button
                onClick={changeStar}
                disabled={changeStarLoading}
                className="flex-shrink-0 mt-0.5 md:mt-1 transition-all disabled:opacity-50 hover:scale-110"
                title={isStarState ? '取消标星' : '标星'}
              >
                <Star
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill={isStarState ? '#facc15' : 'none'}
                  stroke={isStarState ? '#facc15' : '#64748b'}
                  strokeWidth={2}
                />
              </button>
              
              <div className="flex-1 min-w-0">
                <Link
                  to={isPublished ? `/question/static/${_id}` : `/question/edit/${_id}`}
                  className={`text-base md:text-lg font-semibold transition-colors line-clamp-2 block mb-2 ${t.text.primary}`}
                  style={{ color: t.text.primary }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = primaryColor }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '' }}
                >
                  {title}
                </Link>
                
                {/* 元信息 */}
                <div className={`flex items-center gap-2 md:gap-3 text-xs flex-wrap ${t.text.tertiary}`}>
                  <span className="hidden sm:inline">ID: {_id.slice(-6)}</span>
                  <span className={`hidden sm:inline w-1 h-1 rounded-full ${t.isDark ? 'bg-slate-600' : 'bg-gray-300'}`} />
                  <span>{createdAt}</span>
                </div>
              </div>
            </div>

            {/* 右侧：状态标签 */}
            <div className="flex flex-col items-end gap-1.5 md:gap-2 flex-shrink-0">
              {type && (
                <QuestionnaireTypeTag 
                  type={type as QuestionnaireType}
                  showIcon={true}
                  size="small"
                />
              )}
              {isPublished ? (
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-lg px-2 md:px-2.5 py-0.5 md:py-1 border border-emerald-500/20">
                  已发布
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-400 bg-slate-700/30 rounded-lg px-2 md:px-2.5 py-0.5 md:py-1 border border-slate-600/30">
                  未发布
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 底部：统计和操作 */}
        <div className={`relative flex items-center justify-between pt-3 md:pt-4 border-t ${t.divider}`}>
          {/* 答卷数统计 */}
          <div className="flex items-center gap-2">
            <div 
              className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg border"
              style={{
                backgroundColor: primaryColor + '15',
                borderColor: primaryColor + '30'
              }}
            >
              <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: primaryColor }} />
              <span className="text-sm font-semibold" style={{ color: primaryColor }}>{answerCount}</span>
              <span className="text-xs text-slate-500 hidden sm:inline">答卷</span>
            </div>
          </div>

          {/* 操作按钮 - 移动端始终显示，桌面端悬停显示 */}
          <div className="flex items-center gap-1 md:gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => navigate(`/question/edit/${_id}`)}
              className="p-1.5 md:p-2 text-slate-400 rounded-lg transition-all"
              title="编辑问卷"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = primaryColor
                e.currentTarget.style.backgroundColor = primaryColor + '15'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <Edit className="w-4 h-4" strokeWidth={2} />
            </button>
            
            <button
              disabled={!isPublished}
              onClick={() => navigate(`/question/star/${_id}`)}
              className="p-1.5 md:p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hidden sm:flex"
              title="查看统计"
            >
              <BarChart3 className="w-4 h-4" strokeWidth={2} />
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
              className="p-1.5 md:p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all disabled:opacity-50 hidden sm:flex"
              title="复制问卷"
            >
              <Copy className="w-4 h-4" strokeWidth={2} />
            </button>

            <div className="w-px h-4 bg-slate-700/50 mx-0.5 hidden sm:block" />

            <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialog.Trigger asChild>
                <button 
                  className="p-1.5 md:p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="删除问卷"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={2} />
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
      </div>
    </div>
  )
}

export default QuestionsCard
