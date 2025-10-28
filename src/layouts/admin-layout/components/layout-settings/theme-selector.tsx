import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import clsx from 'clsx'
import { CheckCircleFilled } from '@ant-design/icons'

/**
 * 主题选择器组件
 */
const ThemeSelector: React.FC = () => {
  const { themeMode, setThemeMode } = useTheme()
  const { updateConfig } = useLayoutConfig()

  const themes = [
    {
      mode: 'light' as const,
      label: '浅色',
      icon: (
        <div className="w-14 h-14 rounded border-2 border-gray-300 bg-white flex items-center justify-center overflow-hidden">
          <div className="w-full h-full flex">
            <div className="w-1/3 bg-gray-100"></div>
            <div className="w-2/3 bg-white"></div>
          </div>
        </div>
      ),
    },
    {
      mode: 'dark' as const,
      label: '深色',
      icon: (
        <div className="w-14 h-14 rounded border-2 border-gray-600 bg-gray-900 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full flex">
            <div className="w-1/3 bg-gray-800"></div>
            <div className="w-2/3 bg-gray-900"></div>
          </div>
        </div>
      ),
    },
    {
      mode: 'system' as const,
      label: '系统',
      icon: (
        <div className="w-14 h-14 rounded border-2 border-gray-400 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full flex">
            <div className="w-1/2 bg-white"></div>
            <div className="w-1/2 bg-gray-900"></div>
          </div>
        </div>
      ),
    },
  ]

  const handleSelect = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode)
    updateConfig({ themeMode: mode })
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {themes.map((item) => (
        <button
          key={item.mode}
          onClick={() => handleSelect(item.mode)}
          className={clsx(
            'flex flex-col items-center gap-2 p-2 rounded-lg transition-all',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'relative group'
          )}
        >
          <div className="relative">
            {item.icon}
            {themeMode === item.mode && (
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircleFilled className="text-2xl text-blue-500" />
              </div>
            )}
          </div>
          <span
            className={clsx(
              'text-xs font-medium',
              themeMode === item.mode ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'
            )}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  )
}

export default ThemeSelector

