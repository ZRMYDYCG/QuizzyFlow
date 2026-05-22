import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import EnhancedCanvasWrapper from '@/components/canvas/EnhancedCanvasWrapper.tsx'
import useLoadQuestionData from '@/hooks/useLoadQuestionData.ts'
import { useDispatch, useSelector } from 'react-redux'
import { changeSelectedId } from '@/store/modules/question-component.ts'
import {
  setLeftPanelWidth,
  setRightPanelWidth,
  setShowAIPanel,
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
import AISidePanel from '@/features/ai-assistant/components/AISidePanel'
import AIDrawer from '@/features/ai-assistant/components/AIDrawer'

interface EditLocationState {
  aiOpen?: boolean
  aiMessage?: string
}

const MobileAutoAIDrawer: React.FC<{
  questionId?: string
  initialMessage?: string
  onInitialMessageSent: () => void
}> = ({ questionId, initialMessage, onInitialMessageSent }) => {
  const [open, setOpen] = useState(true)
  return (
    <AIDrawer
      open={open}
      onClose={() => setOpen(false)}
      questionId={questionId}
      initialMessage={initialMessage}
      onInitialMessageSent={onInitialMessageSent}
    />
  )
}

const EditQuestionPage: React.FC = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { id } = useParams()
  const { loading, loaded: dataLoaded } = useLoadQuestionData()
  const { title } = useGetPageInfo()
  const { theme } = useTheme()
  const { isMobile } = useResponsive()
  const [pendingAiMessage, setPendingAiMessage] = useState<string | undefined>()

  const {
    showLeftPanel,
    showRightPanel,
    showAIPanel,
    leftPanelWidth,
    rightPanelWidth,
    aiPanelWidth,
  } = useSelector((state: stateType) => state.editorLayout)

  useTitle(`问卷编辑 - ${title}`)

  useEffect(() => {
    const state = location.state as EditLocationState | null
    if (state?.aiOpen) {
      dispatch(setShowAIPanel(true))
    }
    if (state?.aiMessage) {
      setPendingAiMessage(state.aiMessage)
      window.history.replaceState({}, document.title)
    }
  }, [location.state, dispatch])

  const removeSelectedId = () => {
    dispatch(changeSelectedId(''))
  }

  const handleLeftPanelResize = (width: number) => {
    dispatch(setLeftPanelWidth(width))
  }

  const handleRightPanelResize = (width: number) => {
    dispatch(setRightPanelWidth(width))
  }

  const handleInitialMessageSent = () => {
    setPendingAiMessage(undefined)
  }

  // 移动端布局
  if (isMobile) {
    return (
      <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-gray-50'}`}>
        <EditHeader dataLoaded={dataLoaded} />
        
        <div className="flex-auto overflow-hidden pb-16">
          <div
            className="w-full h-full relative"
            onClick={removeSelectedId}
          >
            <EnhancedCanvasWrapper loading={loading} />
            <LayoutToolbar />
          </div>
        </div>

        <MobileBottomNav />
        <MobilePanelDrawer />

        {showAIPanel && dataLoaded && (
          <MobileAutoAIDrawer
            questionId={id}
            initialMessage={pendingAiMessage}
            onInitialMessageSent={handleInitialMessageSent}
          />
        )}
      </div>
    )
  }

  // 桌面端布局
  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-gray-50'}`}>
      <EditHeader dataLoaded={dataLoaded} />
      <div className="flex-auto overflow-hidden">
        <div className="flex h-full">
          {showLeftPanel && (
            <ResizablePanel
              position="left"
              width={leftPanelWidth}
              onWidthChange={handleLeftPanelResize}
            >
              <LeftPanel />
            </ResizablePanel>
          )}
          
          <div
            className="flex-1 relative min-w-0"
            onClick={removeSelectedId}
          >
            <EnhancedCanvasWrapper loading={loading} />
            <LayoutToolbar />
          </div>
          
          {showRightPanel && (
            <ResizablePanel
              position="right"
              width={rightPanelWidth}
              onWidthChange={handleRightPanelResize}
            >
              <RightPanel />
            </ResizablePanel>
          )}

          {showAIPanel && dataLoaded && (
            <AISidePanel
              questionId={id}
              width={aiPanelWidth}
              initialMessage={pendingAiMessage}
              onInitialMessageSent={handleInitialMessageSent}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default EditQuestionPage
