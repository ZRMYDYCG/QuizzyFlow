import React, { useRef } from 'react'
import clsx from 'clsx'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import type { TabNavProps } from './types'
import TabItem from './tab-item'
import { useTabScroll } from './use-tab-scroll'
import './tab-styles.css'

export { loadTabsFromStorage, saveTabsToStorage, getPageTitle, isHomePath } from './utils'
export type { TabItem, TabNavProps } from './types'

/**
 * 动态标签页导航组件
 * 
 * 功能：
 * - 显示当前打开的标签页
 * - 支持点击切换、关闭标签
 * - 支持右键菜单操作
 * - 自动滚动到激活标签
 * - 支持多种样式风格
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
  const { config } = useLayoutConfig()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 自动滚动到当前激活的标签
  useTabScroll(scrollContainerRef, currentPath)

  // 没有标签时不显示
  if (tabs.length === 0) {
    return null
  }

  return (
    <div className="transition-all duration-200 mb-4">
      {/* 标签页容器 - 横向滚动 */}
      <div
        ref={scrollContainerRef}
        className={clsx(
          'h-full overflow-x-auto overflow-y-hidden',
          'scrollbar-thin',
          'scrollbar-thumb-gray-300 scrollbar-track-gray-100',
          'dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800'
        )}
        style={{
          whiteSpace: 'nowrap',
          scrollBehavior: 'smooth',
        }}
      >
        <div className="inline-flex h-full items-center px-2 gap-1">
          {tabs.map((tab) => (
            <TabItem
              key={tab.path}
              tab={tab}
              isActive={tab.path === currentPath}
              currentPath={currentPath}
              tabs={tabs}
              onTabClick={onTabClick}
              onTabClose={onTabClose}
              onCloseOthers={onCloseOthers}
              onCloseAll={onCloseAll}
              onCloseLeft={onCloseLeft}
              onCloseRight={onCloseRight}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TabNav