import React, { useState } from 'react'
import { Dropdown } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import type { TabItemProps } from './types'
import { getContextMenuItems } from './tab-context-menu'

/**
 * 单个标签项组件
 */
const TabItem: React.FC<TabItemProps> = ({
  tab,
  isActive,
  currentPath,
  tabs,
  onTabClick,
  onTabClose,
  onCloseOthers,
  onCloseAll,
  onCloseLeft,
  onCloseRight,
}) => {
  const { theme, themeColors } = useTheme()
  const { config } = useLayoutConfig()
  const [contextMenuVisible, setContextMenuVisible] = useState(false)

  // 处理标签点击
  const handleTabClick = () => {
    onTabClick(tab.path)
  }

  // 处理关闭按钮点击
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onTabClose(tab.path)
  }

  // 处理右键菜单
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenuVisible(true)
  }

  // 右键菜单处理器
  const menuHandlers = {
    onTabClose,
    onCloseOthers,
    onCloseAll,
    onCloseLeft,
    onCloseRight,
    onMenuClose: () => setContextMenuVisible(false),
  }

  return (
    <Dropdown
      menu={{ items: getContextMenuItems(tab, tabs, menuHandlers) }}
      trigger={['contextMenu']}
      open={contextMenuVisible}
      onOpenChange={(visible) => {
        if (!visible) {
          setContextMenuVisible(false)
        }
      }}
    >
      <div
        data-path={tab.path}
        className={clsx(
          'inline-flex items-center h-8 cursor-pointer',
          'transition-all duration-200 select-none',
          'group relative',
          'pl-4',
          tab.closable !== false ? 'pr-2 group-hover:pr-2' : 'pr-4',
          // 根据配置应用不同样式
          config.tabStyle === 'chrome' && 'tab-chrome',
          config.tabStyle === 'card' && 'tab-card',
          config.tabStyle === 'default' && 'tab-default',
          // 激活状态
          isActive && 'active',
          // 默认颜色
          isActive
            ? theme === 'dark'
              ? 'bg-[#2a2a30] text-white'
              : 'bg-white text-gray-900'
            : theme === 'dark'
            ? 'bg-transparent text-gray-400 hover:bg-[#2a2a30] hover:text-gray-200'
            : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
          // 卡片风格边框
          config.tabStyle === 'card' &&
            (theme === 'dark'
              ? 'border-gray-700 hover:border-gray-600'
              : 'border-gray-200 hover:border-gray-300')
        )}
        style={
          isActive && config.tabStyle === 'default'
            ? { borderBottomColor: themeColors.primary }
            : config.tabStyle === 'chrome'
            ? {
                '--tab-active-bg': theme === 'dark' ? '#2a2a30' : '#ffffff',
              } as React.CSSProperties
            : undefined
        }
        onClick={handleTabClick}
        onContextMenu={handleContextMenu}
      >
        {/* 标签标题 */}
        <span className="text-sm font-medium whitespace-nowrap">{tab.title}</span>

        {/* 关闭按钮 */}
        {tab.closable !== false && (
          <button
            className={clsx(
              'flex items-center justify-center h-4 rounded-sm ml-1',
              'transition-all duration-200 ease-in-out',
              'overflow-hidden',
              theme === 'dark'
                ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
                : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700',
              // 默认状态：宽度为0，不可见
              'w-0 opacity-0',
              // 悬停状态：展开宽度，显示
              'group-hover:w-4 group-hover:opacity-100 group-hover:ml-2'
            )}
            onClick={handleCloseClick}
          >
            <CloseOutlined className="text-xs" />
          </button>
        )}
      </div>
    </Dropdown>
  )
}

export default TabItem