import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import EnhancedCanvasWrapper from '@/components/canvas/EnhancedCanvasWrapper.tsx'
import useLoadQuestionData from '@/hooks/useLoadQuestionData.ts'
import { useDispatch, useSelector } from 'react-redux'
import { changeSelectedId } from '@/store/modules/question-component.ts'
import {
  setLeftPanelWidth,
  setRightPanelWidth,
} from '@/store/modules/editor-layout.ts'
import { stateType } from '@/store'
import LeftPanel from './components/left-panel.tsx'
import RightPanel from './components/right-panel.tsx'
import EditHeader from './components/edit-header.tsx'
import LayoutToolbar from './components/layout-toolbar.tsx'
import ResizablePanel from './components/resizable-panel.tsx'
import MobileBottomNav from './components/mobile-bottom-nav.tsx'
import MobilePanelDrawer from './components/mobile-panel-drawer.tsx'
import { useTitle } from 'ahooks'
import useGetPageInfo from '@/hooks/useGetPageInfo'
import { useResponsive } from '@/hooks/useResponsive'

const EditQuestionPage: React.FC = () => {
  const dispatch = useDispatch()
  const { loading } = useLoadQuestionData()
  const { title } = useGetPageInfo()
  const { theme } = useTheme()
  const { isMobile } = useResponsive()

  // 获取布局配置
  const {
    showLeftPanel,
    showRightPanel,
    leftPanelWidth,
    rightPanelWidth,
    canvasScale,
  } = useSelector((state: stateType) => state.editorLayout)

  useTitle(`问卷编辑 - ${title}`)

  const removeSelectedId = () => {
    dispatch(changeSelectedId(''))
  }

  const handleLeftPanelResize = (width: number) => {
    dispatch(setLeftPanelWidth(width))
  }

  const handleRightPanelResize = (width: number) => {
    dispatch(setRightPanelWidth(width))
  }

  // 移动端布局
  if (isMobile) {
    return (
      <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-gray-50'}`}>
        {/* 顶部Header */}
        <EditHeader />
        
        {/* 画布区域 - 占满剩余空间 */}
        <div className="flex-auto overflow-hidden pb-16">
          <div
            className="w-full h-full relative"
            onClick={removeSelectedId}
          >
            <EnhancedCanvasWrapper loading={loading} />
            
            {/* 移动端简化的布局工具栏 */}
            <LayoutToolbar />
          </div>
        </div>

        {/* 底部导航栏 */}
        <MobileBottomNav />

        {/* 移动端抽屉（左右面板和工具栏） */}
        <MobilePanelDrawer />
      </div>
    )
  }

  // 桌面端布局
  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-gray-50'}`}>
      <EditHeader />
      <div className="flex-auto overflow-hidden">
        <div className="flex h-full">
          {/* 左侧物料面板 - 可调整宽度 */}
          {showLeftPanel && (
            <ResizablePanel
              position="left"
              width={leftPanelWidth}
              onWidthChange={handleLeftPanelResize}
            >
              <LeftPanel />
            </ResizablePanel>
          )}
          
          {/* 中间画布区域 - 增强版画布 */}
          <div
            className="flex-1 relative"
            onClick={removeSelectedId}
          >
            <EnhancedCanvasWrapper loading={loading} />
            
            {/* 布局工具栏 */}
            <LayoutToolbar />
          </div>
          
          {/* 右侧属性面板 - 可调整宽度 */}
          {showRightPanel && (
            <ResizablePanel
              position="right"
              width={rightPanelWidth}
              onWidthChange={handleRightPanelResize}
            >
              <RightPanel />
            </ResizablePanel>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditQuestionPage
