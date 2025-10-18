import { FC } from 'react'
import { LucideIcon } from 'lucide-react'
import { useManageTheme } from '@/hooks/useManageTheme'

interface TrashStatCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: string
  subtitle?: string
  isWarning?: boolean
}

const TrashStatCard: FC<TrashStatCardProps> = ({ title, value, icon: Icon, color, subtitle, isWarning }) => {
  const t = useManageTheme()
  
  return (
    <div className="relative group">
      <div className={`p-4 md:p-5 rounded-xl border transition-all duration-300 overflow-hidden ${
        t.isDark 
          ? `bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-sm ${
              isWarning ? 'border-red-500/50 hover:border-red-500/70' : 'border-slate-700/50 hover:border-blue-500/50'
            }` 
          : `bg-white shadow-sm ${
              isWarning ? 'border-red-300 hover:border-red-400' : 'border-gray-200 hover:border-blue-400'
            }`
      }`}>
        {/* 背景装饰 - 仅深色模式 */}
        {t.isDark && (
          <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-all duration-500`} />
        )}
        
        <div className="relative">
          {/* 图标和标题 */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className={`text-xs mb-1 ${t.text.tertiary}`}>{title}</p>
              <p className={`text-2xl md:text-3xl font-bold ${isWarning ? 'text-red-400' : t.text.primary}`}>
                {value}
              </p>
            </div>
            <div className={`p-2.5 rounded-lg ${color} bg-opacity-10 ${isWarning ? 'animate-pulse' : ''}`}>
              <Icon className={`w-5 h-5 ${color}`} strokeWidth={2} />
            </div>
          </div>

          {/* 副标题 */}
          {subtitle && (
            <p className={`text-xs ${t.text.tertiary}`}>{subtitle}</p>
          )}

          {/* 警告标识 */}
          {isWarning && value > 0 && (
            <div className="mt-2 text-xs text-red-400 font-medium">
              ⚠️ 需要注意
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrashStatCard

