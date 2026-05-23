import { FC } from 'react'
import { LucideIcon } from 'lucide-react'
import { useManageTheme } from '@/hooks/useManageTheme'
import { cn } from '@/utils'

interface TrashStatCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: string
  subtitle?: string
}

const TrashStatCard: FC<TrashStatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}) => {
  const t = useManageTheme()

  return (
    <div
      className={cn(
        'p-4 rounded-lg border',
        t.isDark
          ? 'bg-slate-800/40 border-slate-700/50'
          : 'bg-white border-gray-200 shadow-sm'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={cn('text-xs mb-1', t.text.tertiary)}>{title}</p>
          <p className={cn('text-2xl font-semibold', t.text.primary)}>{value}</p>
          {subtitle ? (
            <p className={cn('text-xs mt-1', t.text.tertiary)}>{subtitle}</p>
          ) : null}
        </div>
        <Icon className={cn('w-5 h-5 flex-shrink-0', color)} strokeWidth={2} />
      </div>
    </div>
  )
}

export default TrashStatCard
