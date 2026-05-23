import { FC, useState } from 'react'
import { Clock, RefreshCw, Trash2 } from 'lucide-react'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { useManageTheme } from '@/hooks/useManageTheme'
import { cn } from '@/utils'
import dayjs from 'dayjs'

interface TrashListItemProps {
  question: any
  isSelected: boolean
  onSelect: () => void
  onRestore: () => void
  onDelete: () => void
}

const TrashListItem: FC<TrashListItemProps> = ({
  question,
  isSelected,
  onSelect,
  onRestore,
  onDelete,
}) => {
  const t = useManageTheme()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { title, isPublished, answerCount = 0, deletedAt } = question

  const deletedLabel = deletedAt
    ? dayjs(deletedAt).format('YYYY-MM-DD HH:mm')
    : '—'

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 md:p-4 rounded-lg border transition-colors',
        t.isDark
          ? 'bg-slate-800/20 border-slate-700/40 hover:border-slate-600'
          : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
      )}
    >
      <Checkbox.Root
        checked={isSelected}
        onCheckedChange={onSelect}
        className={cn(
          'w-5 h-5 rounded border flex-shrink-0 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500',
          t.isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-300'
        )}
      >
        <Checkbox.Indicator>
          <Check className="w-4 h-4 text-white" />
        </Checkbox.Indicator>
      </Checkbox.Root>

      <div className="flex-1 min-w-0">
        <p className={cn('font-medium truncate', t.text.primary)}>{title}</p>
        <div className={cn('mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs', t.text.tertiary)}>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            删除于 {deletedLabel}
          </span>
          <span>{isPublished ? '已发布' : '草稿'}</span>
          <span>{answerCount} 份答卷</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onRestore}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          恢复
        </button>

        <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialog.Trigger asChild>
            <button
              type="button"
              className={cn(
                'inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                t.isDark
                  ? 'text-red-400 hover:bg-red-500/10'
                  : 'text-red-600 hover:bg-red-50'
              )}
            >
              <Trash2 className="w-3.5 h-3.5" />
              删除
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
                删除后将无法恢复，请谨慎操作。
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
                    onClick={onDelete}
                    className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md"
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

export default TrashListItem
