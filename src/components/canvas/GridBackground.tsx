import React from 'react'
import { useSelector } from 'react-redux'
import { stateType } from '@/store'
import { useTheme } from '@/contexts/ThemeContext'

interface GridBackgroundProps {
  children: React.ReactNode
}

/**
 * 网格背景组件
 * 提供可视化的网格背景，帮助用户对齐和定位
 */
const GridBackground: React.FC<GridBackgroundProps> = ({ children }) => {
  const { theme } = useTheme()
  const { showGrid, gridSize, scale } = useSelector(
    (state: stateType) => state.canvasConfig
  )

  const scaledGridSize = gridSize * scale
  const isDark = theme === 'dark'

  // 网格样式
  const gridStyle: React.CSSProperties = showGrid
    ? {
        backgroundImage: `
          linear-gradient(to right, ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(156, 163, 175, 0.15)'} 1px, transparent 1px),
          linear-gradient(to bottom, ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(156, 163, 175, 0.15)'} 1px, transparent 1px)
        `,
        backgroundSize: `${scaledGridSize}px ${scaledGridSize}px`,
      }
    : {}

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        ...gridStyle,
        backgroundColor: isDark ? '#1a1a1f' : '#f3f4f6',
      }}
    >
      {children}
    </div>
  )
}

export default GridBackground

