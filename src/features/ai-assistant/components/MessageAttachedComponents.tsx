/**
 * 用户消息气泡下方展示的引用问卷组件
 */

import React from 'react'
import { Blocks } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils'
import type { AttachedComponentRef } from '../types'
import { getAttachedComponentLabel } from '../utils/component-compact'

interface MessageAttachedComponentsProps {
  items: AttachedComponentRef[]
}

const MessageAttachedComponents: React.FC<MessageAttachedComponentsProps> = ({
  items,
}) => {
  const { theme } = useTheme()

  if (!items.length) return null

  return (
    <div
      className={cn(
        'mt-1.5 flex max-w-full flex-wrap items-center gap-1',
        'justify-end',
      )}
    >
      <span
        className={cn(
          'inline-flex shrink-0 items-center gap-0.5 text-[10px]',
          theme === 'dark' ? 'text-slate-500' : 'text-gray-400',
        )}
      >
        <Blocks className="h-3 w-3" />
        引用
      </span>
      {items.map((item) => (
        <span
          key={item.fe_id}
          className={cn(
            'inline-flex max-w-[140px] truncate rounded-md px-2 py-0.5 text-[11px]',
            theme === 'dark'
              ? 'bg-white/8 text-slate-300 ring-1 ring-white/10'
              : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200/80',
          )}
          title={`${item.type} · ${item.fe_id}`}
        >
          {getAttachedComponentLabel(item)}
        </span>
      ))}
    </div>
  )
}

export default MessageAttachedComponents
