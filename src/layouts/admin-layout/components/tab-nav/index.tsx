import React, { useRef, useState, useEffect } from 'react'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import {
  CloseOutlined,
  CloseCircleOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import clsx from 'clsx'
import './tab-styles.css'

// ==================== 类型定义 ====================

/** 标签页项 */
export interface TabItem {
  path: string
  title: string
  closable?: boolean
  icon?: string
}

/** TabNav 组件属性 */
export interface TabNavProps {
  currentPath: string
  tabs: TabItem[]
  onTabClick: (path: string) => void
  onTabClose: (path: string) => void
  onCloseOthers: (path: string) => void
  onCloseAll: () => void
  onCloseLeft: (path: string) => void
  onCloseRight: (path: string) => void
}

// ==================== 工具函数 ====================

const STORAGE_KEY = 'admin_tabs_cache'

/** 从本地存储加载标签页 */
export const loadTabsFromStorage = (): TabItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load tabs:', error)
    return []
  }
}

/** 保存标签页到本地存储 */
export const saveTabsToStorage = (tabs: TabItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs))
  } catch (error) {
    console.error('Failed to save tabs:', error)
  }
}

/** 根据路径获取页面标题 */
export const getPageTitle = (path: string): string => {
  const titleMap: Record<string, string> = {
    '/admin/dashboard': '仪表板',
    '/admin/users': '用户管理',
    '/admin/roles': '角色管理',
    '/admin/permissions': '权限管理',
    '/admin/questions': '问卷管理',
    '/admin/logs': '操作日志',
    '/admin/settings': '系统设置',
  }
  return titleMap[path] || '未知页面'
}

/** 检查路径是否为首页 */
export const isHomePath = (path: string): boolean => {
  return path === '/admin/dashboard'
}

// ==================== TabNav 组件 ====================

/**
 * 动态标签页导航组件
 */
const TabNav: React.FC<TabNavProps> = ({
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [contextMenuTab, setContextMenuTab] = useState<TabItem | null>(null)
  const [contextMenuVisible, setContextMenuVisible] = useState(false)

  // 自动滚动到当前激活的标签
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const activeTab = container.querySelector(`[data-path="${currentPath}"]`) as HTMLElement
    if (activeTab) {
      const containerRect = container.getBoundingClientRect()
      const tabRect = activeTab.getBoundingClientRect()

      // 如果标签不在可视区域内，滚动到它
      if (tabRect.left < containerRect.left) {
        container.scrollLeft -= containerRect.left - tabRect.left + 20
      } else if (tabRect.right > containerRect.right) {
        container.scrollLeft += tabRect.right - containerRect.right + 20
      }
    }
  }, [currentPath])

  // 处理标签点击
  const handleTabClick = (path: string) => {
    onTabClick(path)
  }

  // 处理关闭按钮点击
  const handleCloseClick = (e: React.MouseEvent, path: string) => {
    e.stopPropagation()
    onTabClose(path)
  }

  // 处理右键菜单
  const handleContextMenu = (e: React.MouseEvent, tab: TabItem) => {
    e.preventDefault()
    setContextMenuTab(tab)
    setContextMenuVisible(true)
  }

  // 获取当前标签的索引
  const getCurrentTabIndex = (path: string): number => {
    return tabs.findIndex((tab) => tab.path === path)
  }

  // 右键菜单项
  const getContextMenuItems = (tab: TabItem): MenuProps['items'] => {
    const currentIndex = getCurrentTabIndex(tab.path)
    const isFirst = currentIndex === 0
    const isLast = currentIndex === tabs.length - 1
    const isOnlyOne = tabs.length === 1

    return [
      {
        key: 'close',
        label: '关闭',
        icon: <CloseOutlined />,
        disabled: !tab.closable,
        onClick: () => {
          onTabClose(tab.path)
          setContextMenuVisible(false)
        },
      },
      {
        key: 'close-others',
        label: '关闭其他',
        icon: <CloseCircleOutlined />,
        disabled: isOnlyOne,
        onClick: () => {
          onCloseOthers(tab.path)
          setContextMenuVisible(false)
        },
      },
      {
        type: 'divider',
      },
      {
        key: 'close-left',
        label: '关闭左侧',
        icon: <VerticalRightOutlined />,
        disabled: isFirst,
        onClick: () => {
          onCloseLeft(tab.path)
          setContextMenuVisible(false)
        },
      },
      {
        key: 'close-right',
        label: '关闭右侧',
        icon: <VerticalLeftOutlined />,
        disabled: isLast,
        onClick: () => {
          onCloseRight(tab.path)
          setContextMenuVisible(false)
        },
      },
      {
        type: 'divider',
      },
      {
        key: 'close-all',
        label: '关闭所有',
        icon: <MinusCircleOutlined />,
        danger: true,
        onClick: () => {
          onCloseAll()
          setContextMenuVisible(false)
        },
      },
    ]
  }

  if (tabs.length === 0) {
    return null
  }

  return (
    <div
      className={clsx(
        'transition-all duration-200 mb-4',
      )}
    >
      {/* 标签页容器 - 横向滚动 */}
      <div
        ref={scrollContainerRef}
        className={clsx(
          'h-full overflow-x-auto overflow-y-hidden',
          'scrollbar-thin',
          theme === 'dark' 
            ? 'scrollbar-thumb-gray-600 scrollbar-track-gray-800' 
            : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100'
        )}
        style={{
          whiteSpace: 'nowrap',
          scrollBehavior: 'smooth',
        }}
      >
        <div className="inline-flex h-full items-center px-2 gap-1">
          {tabs.map((tab) => {
            const isActive = tab.path === currentPath

            return (
              <Dropdown
                key={tab.path}
                menu={{ items: getContextMenuItems(tab) }}
                trigger={['contextMenu']}
                open={contextMenuVisible && contextMenuTab?.path === tab.path}
                onOpenChange={(visible) => {
                  if (!visible) {
                    setContextMenuVisible(false)
                    setContextMenuTab(null)
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
                    config.tabStyle === 'card' && (
                      theme === 'dark' 
                        ? 'border-gray-700 hover:border-gray-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    )
                  )}
                  style={
                    isActive && config.tabStyle === 'default'
                      ? { borderBottomColor: themeColors.primary }
                      : config.tabStyle === 'chrome'
                      ? { '--tab-active-bg': theme === 'dark' ? '#2a2a30' : '#ffffff' } as React.CSSProperties
                      : undefined
                  }
                  onClick={() => handleTabClick(tab.path)}
                  onContextMenu={(e) => handleContextMenu(e, tab)}
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
                      onClick={(e) => handleCloseClick(e, tab.path)}
                    >
                      <CloseOutlined className="text-xs" />
                    </button>
                  )}
                </div>
              </Dropdown>
            )
          })}
        </div>
      </div>

      {/* 自定义滚动条样式 */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? '#4b5563' : '#9ca3af'};
        }
      `}</style>
    </div>
  )
}

export default TabNav
