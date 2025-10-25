import React from 'react'
import { Button, Tooltip, Divider, Space } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
  EyeOutlined,
  LayoutOutlined,
  FullscreenOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  ColumnWidthOutlined,
} from '@ant-design/icons'
import { stateType } from '@/store'
import {
  setViewMode,
  toggleLeftPanel,
  toggleRightPanel,
  resetLayout,
  ViewMode,
} from '@/store/modules/editor-layout'
import { useTheme } from '@/contexts/ThemeContext'
import { useResponsive } from '@/hooks/useResponsive'

const LayoutToolbar: React.FC = () => {
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { isMobile } = useResponsive()
  const {
    viewMode,
    showLeftPanel,
    showRightPanel,
  } = useSelector((state: stateType) => state.editorLayout)

  // 视图模式配置
  const viewModeConfig = {
    standard: { icon: <LayoutOutlined />, label: '标准', desc: '显示全部面板' },
    focus: { icon: <FullscreenOutlined />, label: '专注', desc: '隐藏所有面板' },
    preview: { icon: <EyeOutlined />, label: '预览', desc: '预览模式' },
  }

  const handleViewModeChange = (mode: ViewMode) => {
    dispatch(setViewMode(mode))
  }

  const handleReset = () => {
    dispatch(resetLayout())
  }

  const isDark = theme === 'dark'

  // 移动端显示简化版工具栏
  if (isMobile) {
    return (
      <div
        className={`absolute bottom-20 left-1/2 -translate-x-1/2 z-40 ${
          isDark ? 'bg-[#2a2a2f]' : 'bg-white'
        } rounded-full shadow-2xl border ${
          isDark ? 'border-white/10' : 'border-gray-200'
        } px-3 py-1.5`}
        onClick={(e) => e.stopPropagation()}
      >
        <Space size="small">
          {/* 视图模式切换 - 仅图标 */}
          {(Object.keys(viewModeConfig) as ViewMode[]).map((mode) => {
            const config = viewModeConfig[mode]
            return (
              <Tooltip key={mode} title={config.desc}>
                <Button
                  type={viewMode === mode ? 'primary' : 'text'}
                  icon={config.icon}
                  size="small"
                  onClick={() => handleViewModeChange(mode)}
                />
              </Tooltip>
            )
          })}

          <Divider type="vertical" className="mx-1" />

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

  // 桌面端显示完整工具栏
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

