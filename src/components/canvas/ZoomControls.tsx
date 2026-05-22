import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Button, Slider, Tooltip, Dropdown } from 'antd'
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  SettingOutlined,
  DashOutlined,
  BorderOutlined,
} from '@ant-design/icons'
import { GripVertical } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setScale,
  resetCanvas,
  fitToScreen,
  toggleGrid,
  toggleRuler,
} from '@/store/modules/canvas-config'
import { stateType } from '@/store'
import type { MenuProps } from 'antd'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils'

const STORAGE_KEY = 'quizzyflow-zoom-controls-position'
const RULER_SIZE = 30
const DEFAULT_TOP_GAP = 16

interface PanelPosition {
  x: number
  y: number
}

const loadSavedPosition = (): PanelPosition | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PanelPosition
    if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
      return parsed
    }
  } catch {
    // ignore
  }
  return null
}

const clampPosition = (
  x: number,
  y: number,
  panelWidth: number,
  panelHeight: number,
  parentWidth: number,
  parentHeight: number,
  minY = 8
): PanelPosition => ({
  x: Math.max(8, Math.min(x, parentWidth - panelWidth - 8)),
  y: Math.max(minY, Math.min(y, parentHeight - panelHeight - 8)),
})

/**
 * 缩放控制组件（可拖动，默认右上角）
 */
const ZoomControls: React.FC = () => {
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { scale, showGrid, showRuler } = useSelector(
    (state: stateType) => state.canvasConfig
  )

  const panelRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    startX: number
    startY: number
    origX: number
    origY: number
  } | null>(null)

  const [position, setPosition] = useState<PanelPosition | null>(loadSavedPosition)
  const [isDragging, setIsDragging] = useState(false)

  const percentage = Math.round(scale * 100)
  const isDark = theme === 'dark'
  const minTop = showRuler ? RULER_SIZE + DEFAULT_TOP_GAP : 8

  const initDefaultPosition = useCallback(() => {
    const panel = panelRef.current
    const parent = panel?.offsetParent as HTMLElement | null
    if (!panel || !parent) return

    const panelRect = panel.getBoundingClientRect()
    const defaultTop = showRuler ? RULER_SIZE + DEFAULT_TOP_GAP : 16

    setPosition(
      clampPosition(
        parent.clientWidth - panelRect.width - 16,
        defaultTop,
        panelRect.width,
        panelRect.height,
        parent.clientWidth,
        parent.clientHeight,
        minTop
      )
    )
  }, [showRuler, minTop])

  useEffect(() => {
    if (position !== null) return
    initDefaultPosition()
  }, [position, initDefaultPosition])

  // 开启标尺时，避免工具栏与顶部标尺重叠
  useEffect(() => {
    if (!showRuler || position === null) return
    const minTop = RULER_SIZE + DEFAULT_TOP_GAP
    if (position.y < minTop) {
      setPosition((prev) => (prev ? { ...prev, y: minTop } : prev))
    }
  }, [showRuler, position, minTop])

  useEffect(() => {
    if (position === null) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(position))
  }, [position])

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (position === null) return
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: position.x,
      origY: position.y,
    }
    setIsDragging(true)
  }

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !panelRef.current) return
    const parent = panelRef.current.offsetParent as HTMLElement | null
    if (!parent) return

    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    const panelRect = panelRef.current.getBoundingClientRect()

    setPosition(
      clampPosition(
        dragRef.current.origX + dx,
        dragRef.current.origY + dy,
        panelRect.width,
        panelRect.height,
        parent.clientWidth,
        parent.clientHeight,
        minTop
      )
    )
  }

  const handleDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    dragRef.current = null
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const handleZoomIn = () => {
    dispatch(setScale(Math.min(2, scale + 0.1)))
  }

  const handleZoomOut = () => {
    dispatch(setScale(Math.max(0.25, scale - 0.1)))
  }

  const handleReset = () => {
    dispatch(resetCanvas())
  }

  const handleFitScreen = () => {
    dispatch(fitToScreen())
  }

  const scalePresets = [25, 50, 75, 100, 125, 150, 200]

  const settingsMenu: MenuProps['items'] = [
    {
      key: 'grid',
      icon: <DashOutlined />,
      label: (
        <div onClick={() => dispatch(toggleGrid())}>
          {showGrid ? '✓ ' : '　'}显示网格
        </div>
      ),
    },
    {
      key: 'ruler',
      icon: <BorderOutlined />,
      label: (
        <div onClick={() => dispatch(toggleRuler())}>
          {showRuler ? '✓ ' : '　'}显示标尺
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'presets',
      label: '快捷缩放',
      type: 'group',
      children: scalePresets.map((preset) => ({
        key: `preset-${preset}`,
        label: `${preset}%`,
        onClick: () => dispatch(setScale(preset / 100)),
      })),
    },
    { type: 'divider' },
    {
      key: 'reset',
      label: '重置视图',
      onClick: handleReset,
    },
    {
      key: 'reset-position',
      label: '重置工具栏位置',
      onClick: initDefaultPosition,
    },
  ]

  return (
    <div
      ref={panelRef}
      style={{
        left: position?.x ?? undefined,
        top: position?.y ?? (showRuler ? RULER_SIZE + DEFAULT_TOP_GAP : 16),
        visibility: position === null ? 'hidden' : 'visible',
      }}
      className={cn(
        'absolute z-50 flex items-center gap-1.5 rounded-xl border p-2 shadow-lg',
        isDragging && 'select-none',
        isDark ? 'border-white/10 bg-[#2a2a2f]/95' : 'border-gray-200 bg-white/95'
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label="拖动缩放工具栏"
        className={cn(
          'flex shrink-0 cursor-grab items-center rounded-md px-0.5 py-1 text-gray-400',
          'hover:bg-black/5 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-gray-200',
          isDragging && 'cursor-grabbing'
        )}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <Tooltip title="缩小">
        <Button
          icon={<ZoomOutOutlined />}
          onClick={handleZoomOut}
          disabled={scale <= 0.25}
          size="small"
          className={isDark ? 'border-white/10' : ''}
        />
      </Tooltip>

      <Slider
        min={25}
        max={200}
        value={percentage}
        onChange={(value) => dispatch(setScale(value / 100))}
        className="w-24"
        tooltip={{ formatter: (value) => `${value}%` }}
      />

      <Tooltip title="放大">
        <Button
          icon={<ZoomInOutlined />}
          onClick={handleZoomIn}
          disabled={scale >= 2}
          size="small"
          className={isDark ? 'border-white/10' : ''}
        />
      </Tooltip>

      <div
        className={cn(
          'min-w-[42px] text-center text-xs font-medium tabular-nums',
          isDark ? 'text-gray-300' : 'text-gray-700'
        )}
      >
        {percentage}%
      </div>

      <Tooltip title="适应屏幕">
        <Button
          icon={<FullscreenOutlined />}
          onClick={handleFitScreen}
          size="small"
          className={isDark ? 'border-white/10' : ''}
        />
      </Tooltip>

      <Dropdown menu={{ items: settingsMenu }} trigger={['click']} placement="topRight">
        <Button
          icon={<SettingOutlined />}
          size="small"
          className={isDark ? 'border-white/10' : ''}
        />
      </Dropdown>
    </div>
  )
}

export default ZoomControls
