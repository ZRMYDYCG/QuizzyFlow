import { FC } from 'react'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { useManageTheme } from '@/hooks/useManageTheme'

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'emerald' | 'cyan' | 'orange' | 'red'
  trend?: 'up' | 'down'
  percentage?: number
  subtitle?: string
}

const colorMap = {
  blue: {
    icon: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    glow: 'bg-blue-500/5',
  },
  green: {
    icon: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    glow: 'bg-emerald-500/5',
  },
  yellow: {
    icon: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    glow: 'bg-yellow-500/5',
  },
  purple: {
    icon: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    glow: 'bg-purple-500/5',
  },
  emerald: {
    icon: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    glow: 'bg-emerald-500/5',
  },
  cyan: {
    icon: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    glow: 'bg-cyan-500/5',
  },
  orange: {
    icon: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    glow: 'bg-orange-500/5',
  },
  red: {
    icon: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    glow: 'bg-red-500/5',
  },
}

const StatCard: FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color,
  trend,
  percentage,
  subtitle,
}) => {
  const t = useManageTheme()
  const colors = colorMap[color]

  return (
    <div className={`relative p-4 md:p-5 rounded-xl border transition-all duration-300 group hover:scale-[1.02] ${
      t.isDark 
        ? 'bg-gradient-to-br from-slate-800/80 to-slate-800/40 border-slate-700/50 hover:border-slate-600' 
        : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
    }`}>
      {/* 背景光晕 - 仅深色模式 */}
      {t.isDark && (
        <div className={`absolute top-0 right-0 w-24 h-24 ${colors.glow} rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity`} />
      )}

      {/* 内容 */}
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-lg ${colors.bg} border ${colors.border}`}>
            <Icon className={`w-5 h-5 ${colors.icon}`} strokeWidth={2} />
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              trend === 'up' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {trend === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
            </div>
          )}

          {percentage !== undefined && !trend && (
            <div className={`text-xs font-medium ${colors.icon}`}>
              {percentage}%
            </div>
          )}
        </div>

        <div className={`text-2xl md:text-3xl font-bold mb-1 ${t.text.primary}`}>
          {value.toLocaleString()}
        </div>

        <div className="flex items-center justify-between">
          <div className={`text-xs md:text-sm ${t.text.tertiary}`}>
            {title}
          </div>
        </div>

        {subtitle && (
          <div className={`text-xs mt-2 ${t.text.secondary}`}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard

