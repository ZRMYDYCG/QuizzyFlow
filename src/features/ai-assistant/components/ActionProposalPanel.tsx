/**
 * AI 操作提案：可折叠 + 紧凑表单预览
 */
import React, { useMemo, useState } from 'react'
import { Button, Collapse } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { ChevronDown, ChevronRight, ListChecks } from 'lucide-react'
import { AIAction } from '../types'
import { buildActionFormModel, type ActionFormField } from '../utils/action-proposal-form'
import { cn } from '@/utils'

interface ActionProposalPanelProps {
  actions: AIAction[]
  onExecuteAction?: (action: AIAction) => void
  isExecuting?: boolean
  executingActionId?: string | null
}

function StatusBadge({
  applied,
  suggestion,
}: {
  applied: boolean
  suggestion: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 rounded px-1.5 py-0.5 text-[10px] leading-none',
        applied && 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
        !applied && !suggestion && 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        suggestion && 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
      )}
    >
      {applied ? '已应用' : suggestion ? '参考' : '待应用'}
    </span>
  )
}

function CompactFieldGrid({ fields }: { fields: ActionFormField[] }) {
  return (
    <dl className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-2 gap-y-1.5 text-[11px] leading-snug">
      {fields.map((field) => (
        <React.Fragment key={field.label}>
          <dt className="truncate text-gray-400">{field.label}</dt>
          <dd
            className={cn(
              'min-w-0 break-words text-gray-700 dark:text-gray-300',
              field.label === 'ID' && 'font-mono text-[10px] text-gray-400',
              field.multiline && 'whitespace-pre-wrap',
            )}
          >
            {field.value || '—'}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  )
}

const ActionProposalPanel: React.FC<ActionProposalPanelProps> = ({
  actions,
  onExecuteAction,
  isExecuting,
  executingActionId,
}) => {
  const executableActions = actions.filter((a) => a.type !== 'suggest_improvement')
  const pendingCount = executableActions.filter((a) => !a.applied).length
  const appliedCount = executableActions.filter((a) => a.applied).length

  const [expanded, setExpanded] = useState(pendingCount > 0)

  const defaultActiveKey = useMemo(() => {
    const firstPending = actions.findIndex(
      (a) => !a.applied && a.type !== 'suggest_improvement',
    )
    const index = firstPending >= 0 ? firstPending : 0
    return [buildActionFormModel(actions[index], index).key]
  }, [actions])

  const collapseItems = useMemo(
    () =>
      actions.map((action, index) => {
        const model = buildActionFormModel(action, index)
        const isApplied = model.status === 'applied'
        const isSuggestion = model.status === 'info'

        return {
          key: model.key,
          label: (
            <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
              <span className="shrink-0 tabular-nums text-[10px] text-gray-400">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-[11px] text-gray-700 dark:text-gray-200">
                {model.title}
              </span>
              <StatusBadge applied={isApplied} suggestion={isSuggestion} />
            </div>
          ),
          children: (
            <div
              className={cn(
                'rounded border px-2 py-1.5',
                isApplied
                  ? 'border-green-100/80 bg-green-50/30 dark:border-green-900/30 dark:bg-green-950/15'
                  : 'border-gray-100 bg-gray-50/40 dark:border-gray-800 dark:bg-gray-900/20',
              )}
            >
              <CompactFieldGrid fields={model.fields} />

              {model.isExecutable && !isApplied && (
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  loading={isExecuting && executingActionId === action.id}
                  disabled={!action.id}
                  onClick={() => onExecuteAction?.(action)}
                  className="mt-2 shrink-0"
                >
                  应用此操作
                </Button>
              )}
            </div>
          ),
        }
      }),
    [actions, isExecuting, executingActionId, onExecuteAction],
  )

  return (
    <div className="mt-1.5 w-full min-w-0 overflow-hidden rounded-md border border-gray-200/70 dark:border-gray-700/70">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full min-w-0 items-center gap-1.5 px-2 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/40"
      >
        <ListChecks className="h-3.5 w-3.5 shrink-0 text-gray-400" />
        <span className="min-w-0 flex-1 truncate text-[11px] text-gray-600 dark:text-gray-300">
          操作提案
          <span className="text-gray-400">
            {' '}
            · {actions.length} 项
            {appliedCount > 0 && ` · ${appliedCount} 已应用`}
            {pendingCount > 0 && ` · ${pendingCount} 待应用`}
          </span>
        </span>
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="min-w-0 border-t border-gray-100 px-1 pb-1 pt-0.5 dark:border-gray-800">
          <Collapse
            bordered={false}
            size="small"
            defaultActiveKey={defaultActiveKey}
            items={collapseItems}
            className={cn(
              'action-proposal-collapse min-w-0 bg-transparent!',
              '[&_.ant-collapse-item]:border-gray-100! dark:[&_.ant-collapse-item]:border-gray-800!',
              '[&_.ant-collapse-header]:min-w-0! [&_.ant-collapse-header]:overflow-hidden! [&_.ant-collapse-header]:px-1! [&_.ant-collapse-header]:py-1!',
              '[&_.ant-collapse-header-text]:min-w-0! [&_.ant-collapse-header-text]:flex-1! [&_.ant-collapse-header-text]:overflow-hidden!',
              '[&_.ant-collapse-expand-icon]:shrink-0! [&_.ant-collapse-expand-icon]:ps-0!',
              '[&_.ant-collapse-content-box]:px-1! [&_.ant-collapse-content-box]:pb-1! [&_.ant-collapse-content-box]:pt-0.5!',
            )}
          />
        </div>
      )}
    </div>
  )
}

export default ActionProposalPanel
