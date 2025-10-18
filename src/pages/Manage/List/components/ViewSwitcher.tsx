import { FC } from 'react'
import { LayoutGrid, List, Table2 } from 'lucide-react'
import { useManageTheme } from '@/hooks/useManageTheme'

export type ViewMode = 'card' | 'list' | 'table'

interface ViewSwitcherProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

const ViewSwitcher: FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  const t = useManageTheme()
  
  const views: Array<{ mode: ViewMode; icon: any; label: string }> = [
    { mode: 'card', icon: LayoutGrid, label: '卡片视图' },
    { mode: 'list', icon: List, label: '列表视图' },
    { mode: 'table', icon: Table2, label: '表格视图' },
  ]

  return (
    <div className={`flex items-center gap-0.5 md:gap-1 p-0.5 md:p-1 rounded-lg border ${t.isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-gray-100 border-gray-200'}`}>
      {views.map(({ mode, icon: Icon, label }) => {
        const isActive = currentView === mode
        return (
          <button
            key={mode}
            onClick={() => onViewChange(mode)}
            title={label}
            className={`
              flex items-center justify-center px-2.5 py-2 md:px-3 md:py-2 rounded-md transition-all text-sm
              ${
                isActive
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : t.isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }
            `}
          >
            <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2} />
          </button>
        )
      })}
    </div>
  )
}

export default ViewSwitcher

