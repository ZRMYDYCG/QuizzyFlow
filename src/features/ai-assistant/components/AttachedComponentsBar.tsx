/**
 * 已引用的问卷组件标签（仅在有引用时展示）
 */

import React from 'react'
import { X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils'
import type { AttachedComponentRef } from '../types'
import { getAttachedComponentLabel } from '../utils/component-compact'

interface AttachedComponentsBarProps {
  items: AttachedComponentRef[]
  onChange: (items: AttachedComponentRef[]) => void
  disabled?: boolean
}

const AttachedComponentsBar: React.FC<AttachedComponentsBarProps> = ({
  items,
  onChange,
  disabled = false,
}) => {
  const { theme } = useTheme()

  if (items.length === 0) return null

  return (
    <div className="mb-2 flex flex-wrap items-center gap-1.5">
      {items.map((item) => (
        <span
          key={item.fe_id}
          className={cn(
            'inline-flex max-w-[160px] items-center gap-1 rounded-full py-0.5 pl-2.5 pr-1 text-[11px]',
            theme === 'dark'
              ? 'bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/20'
              : 'bg-violet-50 text-violet-700 ring-1 ring-violet-200/80',
          )}
          title={`${item.type} · ${item.fe_id}`}
        >
          <span className="truncate">{getAttachedComponentLabel(item)}</span>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(items.filter((i) => i.fe_id !== item.fe_id))}
            className={cn(
              'shrink-0 rounded-full p-0.5 transition-colors disabled:opacity-40',
              theme === 'dark'
                ? 'hover:bg-violet-400/20 hover:text-white'
                : 'hover:bg-violet-100 hover:text-violet-900',
            )}
            aria-label="移除引用"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  )
}

export default AttachedComponentsBar
