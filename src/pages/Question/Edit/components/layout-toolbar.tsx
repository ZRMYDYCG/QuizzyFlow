import React from 'react'
import { Button, Dropdown, Tooltip, Divider, Space } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
  EyeOutlined,
  LayoutOutlined,
  FullscreenOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ReloadOutlined,
  ColumnWidthOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { stateType } from '@/store'
import {
  setViewMode,
  toggleLeftPanel,
  toggleRightPanel,
  setCanvasScale,
  resetLayout,
  ViewMode,
} from '@/store/modules/editor-layout'
import { useTheme } from '@/contexts/ThemeContext'

const LayoutToolbar: React.FC = () => {
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const {
    viewMode,
    showLeftPanel,
    showRightPanel,
    canvasScale,
  } = useSelector((state: stateType) => state.editorLayout)

  // 视图模式配置
  const viewModeConfig = {
    standard: { icon: <LayoutOutlined />, label: '标准', desc: '显示全部面板' },
    focus: { icon: <FullscreenOutlined />, label: '专注', desc: '隐藏所有面板' },
    preview: { icon: <EyeOutlined />, label: '预览', desc: '预览模式' },
  }

  // 缩放预设选项
  const scaleOptions: MenuProps['items'] = [
    { key: '50', label: '50%' },
    { key: '75', label: '75%' },
    { key: '100', label: '100%' },
    { key: '125', label: '125%' },
    { key: '150', label: '150%' },
    { type: 'divider' },
    { key: 'fit', label: '自适应' },
  ]

  const handleScaleChange: MenuProps['onClick'] = ({ key }) => {
    if (key === 'fit') {
      dispatch(setCanvasScale(100))
    } else {
      dispatch(setCanvasScale(Number(key)))
    }
  }

  const handleViewModeChange = (mode: ViewMode) => {
    dispatch(setViewMode(mode))
  }

  const handleZoomIn = () => {
    dispatch(setCanvasScale(Math.min(200, canvasScale + 10)))
  }

  const handleZoomOut = () => {
    dispatch(setCanvasScale(Math.max(25, canvasScale - 10)))
  }

  const handleReset = () => {
    dispatch(resetLayout())
  }

  const isDark = theme === 'dark'

  return (
    <div
      className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-50 ${
        isDark ? 'bg-[#2a2a2f]' : 'bg-white'
      } rounded-full shadow-2xl border ${
        isDark ? 'border-white/10' : 'border-gray-200'
      } px-4 py-2`}
      onClick={(e) => e.stopPropagation()}
    >
      <Space size="small" split={<Divider type="vertical" className="mx-1" />}>
        {/* 视图模式切换 */}
        <Space size="small">
          {(Object.keys(viewModeConfig) as ViewMode[]).map((mode) => {
            const config = viewModeConfig[mode]
            return (
              <Tooltip key={mode} title={config.desc}>
                <Button
                  type={viewMode === mode ? 'primary' : 'text'}
                  icon={config.icon}
                  size="small"
                  onClick={() => handleViewModeChange(mode)}
                >
                  {config.label}
                </Button>
              </Tooltip>
            )
          })}
        </Space>

        {/* 面板切换 */}
        <Space size="small">
          <Tooltip title={showLeftPanel ? '隐藏左侧面板' : '显示左侧面板'}>
            <Button
              type={showLeftPanel ? 'default' : 'text'}
              icon={showLeftPanel ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              size="small"
              onClick={() => dispatch(toggleLeftPanel())}
            />
          </Tooltip>

          <Tooltip title={showRightPanel ? '隐藏右侧面板' : '显示右侧面板'}>
            <Button
              type={showRightPanel ? 'default' : 'text'}
              icon={
                showRightPanel ? (
                  <MenuUnfoldOutlined style={{ transform: 'scaleX(-1)' }} />
                ) : (
                  <MenuFoldOutlined style={{ transform: 'scaleX(-1)' }} />
                )
              }
              size="small"
              onClick={() => dispatch(toggleRightPanel())}
            />
          </Tooltip>
        </Space>

        {/* 缩放控制 */}
        <Space size="small">
          <Tooltip title="缩小">
            <Button
              type="text"
              icon={<ZoomOutOutlined />}
              size="small"
              onClick={handleZoomOut}
              disabled={canvasScale <= 25}
            />
          </Tooltip>

          <Dropdown
            menu={{ items: scaleOptions, onClick: handleScaleChange }}
            trigger={['click']}
          >
            <Button type="text" size="small" className="min-w-[60px]">
              {canvasScale}%
            </Button>
          </Dropdown>

          <Tooltip title="放大">
            <Button
              type="text"
              icon={<ZoomInOutlined />}
              size="small"
              onClick={handleZoomIn}
              disabled={canvasScale >= 200}
            />
          </Tooltip>
        </Space>

        {/* 面板宽度调整提示 */}
        <Tooltip title="拖动面板边缘可调整宽度">
          <Button type="text" icon={<ColumnWidthOutlined />} size="small" disabled />
        </Tooltip>

        {/* 重置按钮 */}
        <Tooltip title="重置布局">
          <Button
            type="text"
            icon={<ReloadOutlined />}
            size="small"
            onClick={handleReset}
          />
        </Tooltip>
      </Space>
    </div>
  )
}

export default LayoutToolbar

