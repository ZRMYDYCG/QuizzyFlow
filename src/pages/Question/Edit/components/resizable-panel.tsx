import React, { useRef, useEffect, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface ResizablePanelProps {
  children: React.ReactNode
  position: 'left' | 'right'
  width: number
  onWidthChange: (width: number) => void
  minWidth?: number
  maxWidth?: number
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  position,
  width,
  onWidthChange,
  minWidth = 200,
  maxWidth = 600,
}) => {
  const { theme } = useTheme()
  const panelRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!panelRef.current) return

      const panelRect = panelRef.current.getBoundingClientRect()
      let newWidth: number

      if (position === 'left') {
        newWidth = e.clientX - panelRect.left
      } else {
        newWidth = panelRect.right - e.clientX
      }

      // 限制宽度范围
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      onWidthChange(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, position, minWidth, maxWidth, onWidthChange])

  const handleMouseDown = () => {
    setIsResizing(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const isDark = theme === 'dark'
  const resizeHandleClass =
    position === 'left' ? 'right-0 cursor-e-resize' : 'left-0 cursor-w-resize'

  return (
    <div
      ref={panelRef}
      className={`relative h-full overflow-hidden flex flex-col ${
        isDark ? 'bg-[#1e1e23]' : 'bg-white'
      } ${position === 'left' ? 'border-r' : 'border-l'} ${
        isDark ? 'border-white/5' : 'border-gray-200'
      }`}
      style={{ width: `${width}px` }}
    >
      {children}

      {/* 可拖拽的分隔条 */}
      <div
        className={`absolute top-0 ${resizeHandleClass} h-full w-1 group z-10`}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* 拖拽提示线 */}
        <div
          className={`absolute top-0 ${
            position === 'left' ? 'right-0' : 'left-0'
          } h-full w-[3px] transition-all duration-200 ${
            isResizing || isHovering
              ? 'bg-blue-500'
              : isDark
              ? 'bg-transparent hover:bg-blue-500/30'
              : 'bg-transparent hover:bg-blue-500/20'
          }`}
        />

        {/* 拖拽手柄 */}
        {(isHovering || isResizing) && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 ${
              position === 'left' ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
            } w-6 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg`}
          >
            <div className="flex gap-0.5">
              <div className="w-0.5 h-4 bg-white rounded-full" />
              <div className="w-0.5 h-4 bg-white rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResizablePanel

