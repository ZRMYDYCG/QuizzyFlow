import React from 'react'
import { Button, Slider, Tooltip, Dropdown } from 'antd'
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  SettingOutlined,
  DashOutlined,
  BorderOutlined,
} from '@ant-design/icons'
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

/**
 * 缩放控制组件
 * 提供缩放、平移、网格、标尺等控制功能
 */
const ZoomControls: React.FC = () => {
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { scale, showGrid, showRuler } = useSelector(
    (state: stateType) => state.canvasConfig
  )

  const percentage = Math.round(scale * 100)
  const isDark = theme === 'dark'

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

  // 快捷缩放选项
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
  ]

  return (
    <div
      className={`fixed bottom-6 right-6 rounded-lg shadow-lg border p-3 z-50 flex items-center gap-2 ${
        isDark
          ? 'bg-[#2a2a2f] border-white/10'
          : 'bg-white border-gray-200'
      }`}
    >
      {/* 缩小按钮 */}
      <Tooltip title="缩小 (Ctrl + -)">
        <Button
          icon={<ZoomOutOutlined />}
          onClick={handleZoomOut}
          disabled={scale <= 0.25}
          size="small"
          className={isDark ? 'border-white/10' : ''}
        />
      </Tooltip>

      {/* 缩放滑块 */}
      <Slider
        min={25}
        max={200}
        value={percentage}
        onChange={(value) => dispatch(setScale(value / 100))}
        className="w-32"
        tooltip={{ formatter: (value) => `${value}%` }}
      />

      {/* 放大按钮 */}
      <Tooltip title="放大 (Ctrl + +)">
        <Button
          icon={<ZoomInOutlined />}
          onClick={handleZoomIn}
          disabled={scale >= 2}
          size="small"
          className={isDark ? 'border-white/10' : ''}
        />
      </Tooltip>

      {/* 百分比显示 */}
      <div
        className={`min-w-[50px] text-center text-sm font-medium ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        {percentage}%
      </div>

      {/* 适应屏幕按钮 */}
      <Tooltip title="适应屏幕">
        <Button
          icon={<FullscreenOutlined />}
          onClick={handleFitScreen}
          size="small"
          className={isDark ? 'border-white/10' : ''}
        />
      </Tooltip>

      {/* 设置菜单 */}
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

