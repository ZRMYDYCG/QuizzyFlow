import { FC, ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { useManageTheme } from '@/hooks/useManageTheme'

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color: string
  trend?: {
    value: number
    isPositive: boolean
  }
  subtitle?: string
}

const StatCard: FC<StatCardProps> = ({ title, value, icon: Icon, color, trend, subtitle }) => {
  const t = useManageTheme()
  
  return (
    <div className="relative group">
      <div className={`p-4 md:p-5 rounded-xl border transition-all duration-300 overflow-hidden ${
        t.isDark 
          ? 'bg-gradient-to-br from-slate-800/80 to-slate-800/40 border-slate-700/50 hover:border-blue-500/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200 hover:border-blue-400 shadow-sm hover:shadow-md'
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
              <p className={`text-2xl md:text-3xl font-bold ${t.text.primary}`}>{value}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${color} bg-opacity-10`}>
              <Icon className={`w-5 h-5 ${color}`} strokeWidth={2} />
            </div>
          </div>

          {/* 趋势或副标题 */}
          {trend && (
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
              <span className={`text-xs ${t.text.tertiary}`}>vs 上月</span>
            </div>
          )}
          {subtitle && (
            <p className={`text-xs ${t.text.tertiary}`}>{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatCard

