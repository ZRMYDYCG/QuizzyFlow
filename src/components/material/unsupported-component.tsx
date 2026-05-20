import type { FC } from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/utils'

interface UnsupportedComponentProps {
  type: string
  title?: string
}

const UnsupportedComponent: FC<UnsupportedComponentProps> = ({ type, title }) => {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-dashed px-4 py-3',
        'border-amber-300/80 bg-amber-50 text-amber-900',
        'dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200'
      )}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
      <div className="min-w-0 text-sm">
        <p className="font-medium">组件已下线，无法预览</p>
        <p className="mt-1 text-xs opacity-80">
          类型：<code className="font-mono">{type}</code>
          {title ? ` · ${title}` : ''}
        </p>
        <p className="mt-1 text-xs opacity-80">
          请选中后按 Delete 删除，或保存问卷前手动移除
        </p>
      </div>
    </div>
  )
}

export default UnsupportedComponent
