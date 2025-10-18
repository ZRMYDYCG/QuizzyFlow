import { FC } from 'react'
import { Filter } from 'lucide-react'
import { useManageTheme } from '@/hooks/useManageTheme'

export type FilterType = 'all' | 'high-value' | 'urgent' | 'draft' | 'published'

interface SmartFilterProps {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  counts: {
    all: number
    highValue: number
    urgent: number
    draft: number
    published: number
  }
}

const SmartFilter: FC<SmartFilterProps> = ({ currentFilter, onFilterChange, counts }) => {
  const t = useManageTheme()
  
  const filters: Array<{ type: FilterType; label: string; count: number; color?: string }> = [
    { type: 'all', label: '全部', count: counts.all },
    { type: 'high-value', label: '高价值', count: counts.highValue, color: 'text-yellow-400' },
    { type: 'urgent', label: '即将清理', count: counts.urgent, color: 'text-red-400' },
    { type: 'draft', label: '草稿', count: counts.draft, color: 'text-slate-400' },
    { type: 'published', label: '已发布', count: counts.published, color: 'text-emerald-400' },
  ]

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border ${
      t.isDark 
        ? 'bg-slate-800/30 border-slate-700/50' 
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <div className={`flex items-center gap-2 ${t.text.secondary}`}>
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">智能筛选</span>
      </div>
      
      <div className="flex-1 flex flex-wrap items-center gap-2">
        {filters.map(({ type, label, count, color }) => {
          const isActive = currentFilter === type
          return (
            <button
              key={type}
              onClick={() => onFilterChange(type)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                  : t.isDark
                    ? 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }
              `}
            >
              <span className={isActive ? 'text-white' : (color || (t.isDark ? 'text-slate-400' : 'text-gray-600'))}>{label}</span>
              {count > 0 && (
                <span className={`ml-1.5 ${isActive ? 'text-white/80' : t.isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                  ({count})
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SmartFilter

