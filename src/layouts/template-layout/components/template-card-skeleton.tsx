import { FC } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils'

interface TemplateCardSkeletonProps {
  count?: number
}

const TemplateCardSkeleton: FC<TemplateCardSkeletonProps> = ({ count = 6 }) => {
  const { theme } = useTheme()

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'overflow-hidden rounded-2xl border animate-pulse',
            theme === 'dark'
              ? 'border-slate-800 bg-slate-900/60'
              : 'border-gray-100 bg-white shadow-sm'
          )}
        >
          <div
            className={cn(
              'aspect-video',
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
            )}
          />
          <div className="space-y-3 p-4">
            <div
              className={cn('h-5 w-3/4 rounded', theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100')}
            />
            <div className="space-y-2">
              <div
                className={cn('h-3 w-full rounded', theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100')}
              />
              <div
                className={cn('h-3 w-5/6 rounded', theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100')}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <div
                className={cn('h-5 w-14 rounded', theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100')}
              />
              <div
                className={cn('h-5 w-12 rounded', theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100')}
              />
            </div>
            <div
              className={cn(
                'flex items-center justify-between border-t pt-3',
                theme === 'dark' ? 'border-slate-800' : 'border-gray-100'
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn('h-6 w-6 rounded-full', theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100')}
                />
                <div
                  className={cn('h-3 w-16 rounded', theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100')}
                />
              </div>
              <div
                className={cn('h-6 w-6 rounded', theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100')}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TemplateCardSkeleton
