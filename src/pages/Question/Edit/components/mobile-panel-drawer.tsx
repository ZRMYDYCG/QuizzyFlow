import React from 'react'
import { Drawer } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setMobileActivePanel, MobileActivePanel } from '@/store/modules/editor-layout'
import { stateType } from '@/store'
import { useTheme } from '@/contexts/ThemeContext'
import LeftPanel from './left-panel'
import RightPanel from './right-panel'
import EditToolbar from './edit-toolbar'

/**
 * 移动端面板抽屉包装器
 * 统一管理左侧面板、右侧面板和编辑工具栏的抽屉显示
 */
const MobilePanelDrawer: React.FC = () => {
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { mobileActivePanel } = useSelector((state: stateType) => state.editorLayout)

  const isDark = theme === 'dark'

  const handleClose = () => {
    dispatch(setMobileActivePanel('none'))
  }

  // 渲染左侧面板抽屉
  if (mobileActivePanel === 'left') {
    return (
      <Drawer
        title="组件库"
        placement="left"
        open={true}
        onClose={handleClose}
        width="85%"
        className={isDark ? 'dark-drawer' : ''}
        styles={{
          header: {
            background: isDark ? '#1e1e23' : '#fff',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #e5e7eb',
          },
          body: {
            background: isDark ? '#1a1a1f' : '#f9fafb',
            padding: 0,
          },
        }}
        destroyOnClose={false}
        maskClosable={true}
        keyboard={true}
      >
        <LeftPanel />
      </Drawer>
    )
  }

  // 渲染右侧面板抽屉
  if (mobileActivePanel === 'right') {
    return (
      <Drawer
        title="属性面板"
        placement="right"
        open={true}
        onClose={handleClose}
        width="85%"
        className={isDark ? 'dark-drawer' : ''}
        styles={{
          header: {
            background: isDark ? '#1e1e23' : '#fff',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #e5e7eb',
          },
          body: {
            background: isDark ? '#1a1a1f' : '#f9fafb',
            padding: 0,
          },
        }}
        destroyOnClose={false}
        maskClosable={true}
        keyboard={true}
      >
        <RightPanel />
      </Drawer>
    )
  }

  // 渲染编辑工具栏抽屉
  if (mobileActivePanel === 'toolbar') {
    return (
      <Drawer
        title="编辑工具"
        placement="bottom"
        open={true}
        onClose={handleClose}
        height="auto"
        className={isDark ? 'dark-drawer' : ''}
        styles={{
          header: {
            background: isDark ? '#1e1e23' : '#fff',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #e5e7eb',
          },
          body: {
            background: isDark ? '#1a1a1f' : '#f9fafb',
            padding: 0,
          },
        }}
        destroyOnClose={false}
        maskClosable={true}
        keyboard={true}
      >
        <div className="py-4">
          <EditToolbar />
        </div>
      </Drawer>
    )
  }

  return null
}

export default MobilePanelDrawer

