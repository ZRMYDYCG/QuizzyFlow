import { FC, useMemo } from 'react'
import { Clock, Database, AlertCircle, Eye, RefreshCw, Trash2 } from 'lucide-react'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { useState } from 'react'

interface EnhancedTrashItemProps {
  question: any
  isSelected: boolean
  onSelect: () => void
  onRestore: () => void
  onDelete: () => void
  autoDeleteDays?: number
}

const EnhancedTrashItem: FC<EnhancedTrashItemProps> = ({
  question,
  isSelected,
  onSelect,
  onRestore,
  onDelete,
  autoDeleteDays = 30,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { _id, title, isPublish, answerCount = 0, createdAt, deletedAt } = question

  // 计算删除天数和剩余天数
  const { daysAgo, remainingDays, isUrgent, isHighValue } = useMemo(() => {
    const now = new Date().getTime()
    const deleted = deletedAt ? new Date(deletedAt).getTime() : now
    const days = Math.floor((now - deleted) / (1000 * 60 * 60 * 24))
    const remaining = autoDeleteDays - days
    
    return {
      daysAgo: days,
      remainingDays: remaining,
      isUrgent: remaining <= 3,
      isHighValue: answerCount >= 50,
    }
  }, [deletedAt, answerCount, autoDeleteDays])

  const getDeletedTimeText = () => {
    if (daysAgo === 0) return '今天'
    if (daysAgo === 1) return '昨天'
    if (daysAgo < 7) return `${daysAgo}天前`
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)}周前`
    return `${Math.floor(daysAgo / 30)}月前`
  }

  return (
    <div className={`
      group p-4 rounded-lg border transition-all
      ${isUrgent 
        ? 'bg-red-900/10 border-red-500/30 hover:border-red-500/50' 
        : 'bg-slate-800/20 border-slate-700/30 hover:border-blue-500/30'
      }
    `}>
      <div className="flex items-start gap-3">
        {/* 复选框 */}
        <div className="flex-shrink-0 mt-1">
          <Checkbox.Root
            checked={isSelected}
            onCheckedChange={onSelect}
            className="w-5 h-5 rounded bg-slate-700/50 border border-slate-600 hover:border-blue-500 transition-colors data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
          >
            <Checkbox.Indicator>
              <Check className="w-4 h-4 text-white" />
            </Checkbox.Indicator>
          </Checkbox.Root>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 min-w-0">
          {/* 标题和标签 */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-slate-200 truncate mb-2">
                {title}
              </h3>
              
              {/* 标签组 */}
              <div className="flex flex-wrap items-center gap-2">
                {/* 删除时间 */}
                <span className={`
                  px-2 py-1 text-xs font-medium rounded border flex items-center gap-1
                  ${isUrgent 
                    ? 'text-red-400 bg-red-500/10 border-red-500/20' 
                    : 'text-slate-400 bg-slate-700/30 border-slate-600/30'
                  }
                `}>
                  <Clock className="w-3 h-3" />
                  {getDeletedTimeText()}
                </span>

                {/* 剩余天数 */}
                {remainingDays > 0 && (
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded border
                    ${isUrgent 
                      ? 'text-red-400 bg-red-500/10 border-red-500/20 animate-pulse' 
                      : 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                    }
                  `}>
                    {remainingDays}天后清理
                  </span>
                )}

                {/* 状态 */}
                {isPublish ? (
                  <span className="px-2 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20">
                    已发布
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium text-slate-400 bg-slate-700/30 rounded border border-slate-600/30">
                    草稿
                  </span>
                )}

                {/* 高价值标识 */}
                {isHighValue && (
                  <span className="px-2 py-1 text-xs font-medium text-yellow-400 bg-yellow-500/10 rounded border border-yellow-500/20 flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    高价值
                  </span>
                )}

                {/* 答卷数 */}
                <span className="text-xs text-slate-500">
                  {answerCount} 答卷
                </span>
              </div>
            </div>

            {/* 警告图标 */}
            {isUrgent && (
              <div className="flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-3">
            <button
              onClick={onRestore}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all text-xs font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              恢复
            </button>

            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-all text-xs">
              <Eye className="w-3.5 h-3.5" />
              预览
            </button>

            <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialog.Trigger asChild>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all text-xs">
                  <Trash2 className="w-3.5 h-3.5" />
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
                    删除后将无法恢复，{isHighValue && '此问卷包含大量数据，'}请谨慎操作！
                  </AlertDialog.Description>
                  <div className="flex gap-3 justify-end">
                    <AlertDialog.Cancel asChild>
                      <button className="px-4 py-2 text-sm text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                        取消
                      </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <button
                        onClick={onDelete}
                        className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
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

export default EnhancedTrashItem

