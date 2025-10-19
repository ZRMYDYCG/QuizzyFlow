import React from 'react'
import Ruler from '@scena/react-ruler'
import { useSelector } from 'react-redux'
import { stateType } from '@/store'
import { useTheme } from '@/contexts/ThemeContext'

interface CanvasRulersProps {
  containerRef?: React.RefObject<HTMLDivElement>
}

/**
 * 画布标尺组件
 * 显示顶部和左侧标尺，帮助用户定位和测量
 */
const CanvasRulers: React.FC<CanvasRulersProps> = ({ containerRef }) => {
  const { theme } = useTheme()
  const { scale, offsetX, offsetY, unit } = useSelector(
    (state: stateType) => state.canvasConfig
  )

  const isDark = theme === 'dark'

  // 标尺样式配置
  const rulerStyles = {
    backgroundColor: isDark ? '#1e1e23' : '#f3f4f6',
    lineColor: isDark ? '#ffffff40' : '#9ca3af',
    textColor: isDark ? '#ffffff80' : '#4b5563',
  }

  return (
    <>
      {/* 顶部水平标尺 */}
      <div
        className={`absolute top-0 left-[30px] right-0 h-[30px] border-b z-20 ${
          isDark ? 'border-white/10' : 'border-gray-300'
        }`}
        style={{
          backgroundColor: rulerStyles.backgroundColor,
          overflow: 'hidden',
        }}
      >
        <Ruler
          type="horizontal"
          zoom={scale}
          scrollPos={-offsetX}
          unit={50}
          backgroundColor={rulerStyles.backgroundColor}
          lineColor={rulerStyles.lineColor}
          textColor={rulerStyles.textColor}
          style={{ width: '100%', height: '30px' }}
        />
      </div>

      {/* 左侧垂直标尺 */}
      <div
        className={`absolute top-[30px] left-0 bottom-0 w-[30px] border-r z-20 ${
          isDark ? 'border-white/10' : 'border-gray-300'
        }`}
        style={{
          backgroundColor: rulerStyles.backgroundColor,
          overflow: 'hidden',
        }}
      >
        <Ruler
          type="vertical"
          zoom={scale}
          scrollPos={-offsetY}
          unit={50}
          backgroundColor={rulerStyles.backgroundColor}
          lineColor={rulerStyles.lineColor}
          textColor={rulerStyles.textColor}
          style={{ width: '30px', height: '100%' }}
        />
      </div>

      {/* 左上角标尺交叉点 */}
      <div
        className={`absolute top-0 left-0 w-[30px] h-[30px] border-r border-b z-30 flex items-center justify-center ${
          isDark
            ? 'bg-[#2a2a2f] border-white/10'
            : 'bg-gray-200 border-gray-300'
        }`}
      >
        <svg
          className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
        </svg>
      </div>
    </>
  )
}

export default CanvasRulers

