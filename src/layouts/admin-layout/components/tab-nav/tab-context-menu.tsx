import React from 'react'
import type { MenuProps } from 'antd'
import {
  CloseOutlined,
  CloseCircleOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons'
import type { TabItem } from './types'
import { getCurrentTabIndex } from './utils'

interface TabContextMenuProps {
  tab: TabItem
  tabs: TabItem[]
  onTabClose: (path: string) => void
  onCloseOthers: (path: string) => void
  onCloseAll: () => void
  onCloseLeft: (path: string) => void
  onCloseRight: (path: string) => void
  onMenuClose: () => void
}

/**
 * 获取标签右键菜单项
 */
export const getContextMenuItems = (
  tab: TabItem,
  tabs: TabItem[],
  handlers: Omit<TabContextMenuProps, 'tab' | 'tabs'>
): MenuProps['items'] => {
  const currentIndex = getCurrentTabIndex(tabs, tab.path)
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
        handlers.onTabClose(tab.path)
        handlers.onMenuClose()
      },
    },
    {
      key: 'close-others',
      label: '关闭其他',
      icon: <CloseCircleOutlined />,
      disabled: isOnlyOne,
      onClick: () => {
        handlers.onCloseOthers(tab.path)
        handlers.onMenuClose()
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
        handlers.onCloseLeft(tab.path)
        handlers.onMenuClose()
      },
    },
    {
      key: 'close-right',
      label: '关闭右侧',
      icon: <VerticalLeftOutlined />,
      disabled: isLast,
      onClick: () => {
        handlers.onCloseRight(tab.path)
        handlers.onMenuClose()
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
        handlers.onCloseAll()
        handlers.onMenuClose()
      },
    },
  ]
}