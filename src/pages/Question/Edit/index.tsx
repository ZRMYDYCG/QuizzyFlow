import React from 'react'
import { ConfigProvider } from 'antd'
import { editorDarkTheme, editorLightTheme } from '@/config/theme.config'
import { useTheme } from '@/contexts/ThemeContext'
import EditCanvas from '@/components/material/edit-canvas.tsx'
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
import { useTitle } from 'ahooks'
import useGetPageInfo from '@/hooks/useGetPageInfo'

const EditQuestionPage: React.FC = () => {
  const dispatch = useDispatch()
  const { loading } = useLoadQuestionData()
  const { title } = useGetPageInfo()
  const { theme } = useTheme()

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

  // 根据主题选择配置
  const currentTheme = theme === 'dark' ? editorDarkTheme : editorLightTheme

  return (
    <ConfigProvider theme={currentTheme}>
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
            
            {/* 中间画布区域 */}
            <div
              className={`flex-1 flex justify-center items-center p-6 relative ${
                theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-gray-100'
              }`}
              onClick={removeSelectedId}
            >
              <div 
                className={`relative overflow-auto shadow-2xl rounded-xl transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-white border border-white/10' 
                    : 'bg-white border border-gray-200'
                }`}
                style={{
                  width: `${400 * (canvasScale / 100)}px`,
                  height: `${712 * (canvasScale / 100)}px`,
                }}
              >
                <div 
                  className="origin-top-left"
                  style={{
                    width: '400px',
                    height: '800px',
                    transform: `scale(${canvasScale / 100})`,
                  }}
                >
                  <EditCanvas loading={loading} />
                </div>
              </div>

              {/* 浮动工具栏 */}
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
    </ConfigProvider>
  )
}

export default EditQuestionPage
