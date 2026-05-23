/**
 * 联网搜索参考链接（展示在助手消息底部）
 */
import React from 'react'
import { ExternalLink, Globe } from 'lucide-react'
import type { WebReference } from '../types'
import { cn } from '@/utils'

interface WebReferencesBlockProps {
  references: WebReference[]
}

const WebReferencesBlock: React.FC<WebReferencesBlockProps> = ({ references }) => {
  if (!references.length) return null

  return (
    <div
      className={cn(
        'mt-3 overflow-hidden rounded-lg border',
        'border-violet-200/70 bg-violet-50/50',
        'dark:border-violet-800/40 dark:bg-violet-950/20',
      )}
    >
      <div className="flex items-center gap-2 border-b border-violet-200/50 px-3 py-2 dark:border-violet-800/30">
        <Globe className="h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-400" />
        <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
          参考资料
        </span>
        <span className="text-[11px] text-violet-500/80 dark:text-violet-400/70">
          {references.length} 条
        </span>
      </div>

      <ul className="divide-y divide-violet-100/80 dark:divide-violet-900/40">
        {references.map((ref) => (
          <li key={ref.url}>
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group flex items-start gap-2 px-3 py-2 transition-colors',
                'hover:bg-violet-100/60 dark:hover:bg-violet-900/20',
              )}
            >
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400 group-hover:text-violet-600 dark:group-hover:text-violet-300" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-violet-800 dark:text-violet-200">
                  {ref.title}
                </div>
                {ref.snippet && (
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-violet-600/80 dark:text-violet-400/80">
                    {ref.snippet}
                  </p>
                )}
                <div className="mt-0.5 truncate text-[10px] text-violet-400/70 dark:text-violet-500/70">
                  {ref.url}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WebReferencesBlock
