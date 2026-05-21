import React from 'react'
import { Progress } from 'antd'
import { cn } from '@/utils'

export interface AnswerProgressBarProps {
  percent: number
  answered: number
  total: number
  primaryColor: string
  isDark: boolean
  paginationLabel?: string
}

const AnswerProgressBar: React.FC<AnswerProgressBarProps> = ({
  percent,
  answered,
  total,
  primaryColor,
  isDark,
  paginationLabel,
}) => (
  <div
    className={cn(
      'shrink-0 z-20 border-b px-4 py-2.5',
      isDark ? 'bg-[#1a1a1f]/95 border-slate-700/80' : 'bg-white/95 border-gray-200'
    )}
    role="progressbar"
    aria-valuenow={percent}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={`答题进度 ${answered} / ${total}`}
  >
    <div className="mx-auto flex max-w-3xl items-center gap-3">
      <Progress
        percent={percent}
        showInfo={false}
        strokeColor={primaryColor}
        trailColor={isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(0, 0, 0, 0.06)'}
        size="small"
        className="mb-0 flex-1 min-w-0 [&_.ant-progress-inner]:!align-middle"
      />
      <span
        className={cn(
          'shrink-0 text-xs tabular-nums whitespace-nowrap',
          isDark ? 'text-slate-400' : 'text-gray-500'
        )}
      >
        {paginationLabel ? (
          <>
            <span className={isDark ? 'text-slate-300' : 'text-gray-600'}>
              {paginationLabel}
            </span>
            <span className="mx-1.5 opacity-40">·</span>
          </>
        ) : null}
        <span className={isDark ? 'text-slate-200' : 'text-gray-700'}>
          {answered}/{total}
        </span>
      </span>
    </div>
  </div>
)

export default AnswerProgressBar
