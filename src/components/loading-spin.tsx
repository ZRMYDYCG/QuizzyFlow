import { Spin, type SpinProps } from 'antd'
import { cn } from '@/utils'

interface LoadingSpinProps extends Pick<SpinProps, 'size' | 'tip'> {
  className?: string
  fullscreen?: boolean
}

/** Spin + tip 须使用 nest 或 fullscreen 模式，避免 antd 警告 */
export function LoadingSpin({
  tip,
  size = 'large',
  className,
  fullscreen,
}: LoadingSpinProps) {
  if (fullscreen) {
    return <Spin tip={tip} size={size} fullscreen />
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Spin tip={tip} size={size}>
        <div className="h-24 w-24" aria-hidden />
      </Spin>
    </div>
  )
}
