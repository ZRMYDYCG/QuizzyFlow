/**
 * Tool Call 调用详情展示（AG-UI tool parts）
 */
import React, { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Wrench } from 'lucide-react'
import type { ToolCallDisplay, ToolCallState } from '../types'
import { cn } from '@/utils'

interface ToolCallsBlockProps {
  toolCalls: ToolCallDisplay[]
  isStreaming?: boolean
}

const STATE_LABELS: Record<ToolCallState, string> = {
  pending: '等待',
  running: '执行中',
  completed: '完成',
  error: '失败',
}

const STATE_CLASS: Record<ToolCallState, string> = {
  pending: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  running: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

function formatJson(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') {
    try {
      return JSON.stringify(JSON.parse(value), null, 2)
    } catch {
      return value
    }
  }
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function ToolCallRow({ call }: { call: ToolCallDisplay }) {
  const [open, setOpen] = useState(call.state === 'running')

  useEffect(() => {
    if (call.state === 'running') setOpen(true)
  }, [call.state])

  const hasDetail = call.input != null || call.output != null || call.summary || call.error

  return (
    <div className="rounded border border-gray-200/80 bg-white/60 dark:border-gray-700/60 dark:bg-gray-900/30">
      <button
        type="button"
        disabled={!hasDetail}
        onClick={() => hasDetail && setOpen((v) => !v)}
        className={cn(
          'flex w-full min-w-0 items-center gap-2 px-2 py-1.5 text-left text-[11px]',
          hasDetail && 'hover:bg-gray-50 dark:hover:bg-gray-800/40',
          !hasDetail && 'cursor-default',
        )}
      >
        <span
          className={cn(
            'inline-flex shrink-0 rounded px-1.5 py-0.5 text-[10px] leading-none',
            call.kind === 'skill'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
              : call.kind === 'component'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
          )}
        >
          {call.kind === 'skill' ? 'Skill' : call.kind === 'component' ? '组件' : 'Tool'}
        </span>
        <span className="min-w-0 flex-1 truncate text-gray-700 dark:text-gray-200">
          {call.displayName}
        </span>
        <span
          className={cn(
            'inline-flex shrink-0 rounded px-1.5 py-0.5 text-[10px] leading-none',
            STATE_CLASS[call.state],
          )}
        >
          {STATE_LABELS[call.state]}
        </span>
        {hasDetail &&
          (open ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          ))}
      </button>

      {open && hasDetail && (
        <div className="space-y-2 border-t border-gray-100 px-2 py-2 dark:border-gray-800">
          {call.summary && (
            <p className="text-[11px] leading-snug text-gray-600 dark:text-gray-300">
              {call.summary}
            </p>
          )}
          {call.error && (
            <p className="text-[11px] text-red-600 dark:text-red-400">{call.error}</p>
          )}
          {call.input != null && (
            <div>
              <div className="mb-1 text-[10px] text-gray-400">输入参数</div>
              <pre className="max-h-32 overflow-auto rounded bg-gray-900 p-2 text-[10px] text-gray-100">
                {formatJson(call.input)}
              </pre>
            </div>
          )}
          {call.output != null && (
            <div>
              <div className="mb-1 text-[10px] text-gray-400">输出结果</div>
              <pre className="max-h-40 overflow-auto rounded bg-gray-900 p-2 text-[10px] text-gray-100">
                {formatJson(call.output)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const ToolCallsBlock: React.FC<ToolCallsBlockProps> = ({ toolCalls, isStreaming }) => {
  const [open, setOpen] = useState(true)
  const runningCount = useMemo(
    () => toolCalls.filter((c) => c.state === 'running' || c.state === 'pending').length,
    [toolCalls],
  )

  useEffect(() => {
    if (isStreaming || runningCount > 0) setOpen(true)
  }, [isStreaming, runningCount])

  if (!toolCalls.length) return null

  return (
    <div
      className={cn(
        'mb-2 overflow-hidden rounded-lg border',
        'border-sky-200/70 bg-sky-50/60',
        'dark:border-sky-800/50 dark:bg-sky-950/30',
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center gap-2 px-3 py-2 text-left text-xs',
          'text-sky-700 dark:text-sky-300',
        )}
      >
        <Wrench className={cn('h-3.5 w-3.5 shrink-0', runningCount > 0 && 'animate-pulse')} />
        <span className="flex-1">
          工具调用
          <span className="text-sky-500/80 dark:text-sky-400/80">
            {' '}
            · {toolCalls.length} 项
            {runningCount > 0 && ` · ${runningCount} 进行中`}
          </span>
        </span>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
        )}
      </button>

      {open && (
        <div className="space-y-1.5 border-t border-sky-200/50 px-2 py-2 dark:border-sky-800/40">
          {toolCalls.map((call) => (
            <ToolCallRow key={call.id} call={call} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ToolCallsBlock
