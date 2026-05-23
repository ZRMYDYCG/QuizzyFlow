import { FC } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { TemplateSortBy, SORT_OPTIONS } from '@/constants/template-categories'
import { cn } from '@/utils'

interface MarketToolbarProps {
  total: number
  sortBy: TemplateSortBy
  onSortChange: (sort: TemplateSortBy) => void
}

const MarketToolbar: FC<MarketToolbarProps> = ({ total, sortBy, onSortChange }) => {
  const { theme } = useTheme()

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className={cn('text-sm', theme === 'dark' ? 'text-slate-400' : 'text-gray-500')}>
        共 <span className="font-semibold">{total}</span> 个模板
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {SORT_OPTIONS.map((option) => {
          const isActive = sortBy === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSortChange(option.value)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? theme === 'dark'
                    ? 'bg-slate-700 text-white'
                    : 'bg-gray-900 text-white'
                  : theme === 'dark'
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MarketToolbar
