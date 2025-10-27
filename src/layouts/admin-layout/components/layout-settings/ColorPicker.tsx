import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import { PRESET_COLORS } from '@/types/layout'
import clsx from 'clsx'
import { CheckOutlined } from '@ant-design/icons'

/**
 * 主题色选择器组件
 */
const ColorPicker: React.FC = () => {
  const { primaryColor, setPrimaryColor } = useTheme()
  const { updateConfig } = useLayoutConfig()

  const handleSelect = (color: string) => {
    setPrimaryColor(color)
    updateConfig({ primaryColor: color })
  }

  return (
    <div className="flex flex-wrap gap-3">
      {PRESET_COLORS.map((item) => (
        <button
          key={item.color}
          onClick={() => handleSelect(item.color)}
          className={clsx(
            'relative w-10 h-10 rounded-lg transition-all',
            'hover:scale-110 active:scale-95',
            'border-2',
            primaryColor === item.color
              ? 'border-gray-400 dark:border-gray-500 shadow-md'
              : 'border-transparent'
          )}
          style={{ backgroundColor: item.color }}
          title={item.name}
        >
          {primaryColor === item.color && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckOutlined className="text-white text-lg drop-shadow" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

export default ColorPicker

