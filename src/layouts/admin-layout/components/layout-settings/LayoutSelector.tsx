import React from 'react'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import type { LayoutMode } from '@/types/layout'
import clsx from 'clsx'

/**
 * 布局选择器组件
 */
const LayoutSelector: React.FC = () => {
  const { config, updateConfig } = useLayoutConfig()

  const layouts: Array<{
    mode: LayoutMode
    label: string
    icon: React.ReactNode
  }> = [
    {
      mode: 'vertical',
      label: '垂直',
      icon: (
        <div className="w-full h-full flex gap-0.5">
          <div className="w-1/4 bg-gray-700 dark:bg-gray-600 rounded-l"></div>
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="h-1/4 bg-gray-400 dark:bg-gray-500 rounded-tr"></div>
            <div className="flex-1 bg-gray-300 dark:bg-gray-400 rounded-br"></div>
          </div>
        </div>
      ),
    },
    {
      mode: 'horizontal',
      label: '水平',
      icon: (
        <div className="w-full h-full flex flex-col gap-0.5">
          <div className="h-1/4 bg-gray-700 dark:bg-gray-600 rounded-t"></div>
          <div className="flex-1 bg-gray-300 dark:bg-gray-400 rounded-b"></div>
        </div>
      ),
    },
    {
      mode: 'mixed',
      label: '混合',
      icon: (
        <div className="w-full h-full flex flex-col gap-0.5">
          <div className="h-1/4 bg-gray-700 dark:bg-gray-600 rounded-t"></div>
          <div className="flex-1 flex gap-0.5">
            <div className="w-1/4 bg-gray-500 dark:bg-gray-500 rounded-bl"></div>
            <div className="flex-1 bg-gray-300 dark:bg-gray-400 rounded-br"></div>
          </div>
        </div>
      ),
    },
    {
      mode: 'columns',
      label: '双列',
      icon: (
        <div className="w-full h-full flex gap-0.5">
          <div className="w-1/6 bg-gray-800 dark:bg-gray-700 rounded-l"></div>
          <div className="w-1/5 bg-gray-600 dark:bg-gray-500"></div>
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="h-1/4 bg-gray-400 dark:bg-gray-500 rounded-tr"></div>
            <div className="flex-1 bg-gray-300 dark:bg-gray-400 rounded-br"></div>
          </div>
        </div>
      ),
    },
  ]

  const handleSelect = (mode: LayoutMode) => {
    updateConfig({ layoutMode: mode })
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {layouts.map((item) => (
        <button
          key={item.mode}
          onClick={() => handleSelect(item.mode)}
          className={clsx(
            'flex flex-col items-center gap-2 p-3 rounded-lg transition-all',
            'border-2',
            config.layoutMode === item.mode
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          )}
        >
          <div className="w-full h-12 rounded overflow-hidden">
            {item.icon}
          </div>
          <span
            className={clsx(
              'text-xs font-medium',
              config.layoutMode === item.mode
                ? 'text-blue-500'
                : 'text-gray-600 dark:text-gray-400'
            )}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  )
}

export default LayoutSelector

