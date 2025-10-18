import React from 'react'
import { ConfigProvider } from 'antd'
import { editorDarkTheme, editorLightTheme } from '@/config/theme.config'
import { useTheme } from '@/contexts/ThemeContext'
import EditCanvas from '@/components/material/edit-canvas.tsx'
import useLoadQuestionData from '@/hooks/useLoadQuestionData.ts'
import { useDispatch } from 'react-redux'
import { changeSelectedId } from '@/store/modules/question-component.ts'
import LeftPanel from './components/left-panel.tsx'
import RightPanel from './components/right-panel.tsx'
import EditHeader from './components/edit-header.tsx'
import { useTitle } from 'ahooks'
import useGetPageInfo from '@/hooks/useGetPageInfo'

const EditQuestionPage: React.FC = () => {
  const dispatch = useDispatch()
  const { loading } = useLoadQuestionData()
  const { title } = useGetPageInfo()
  const { theme } = useTheme()

  useTitle(`问卷编辑 - ${title}`)

  const removeSelectedId = () => {
    dispatch(changeSelectedId(''))
  }

  // 根据主题选择配置
  const currentTheme = theme === 'dark' ? editorDarkTheme : editorLightTheme

  return (
    <ConfigProvider theme={currentTheme}>
      <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-gray-50'}`}>
        <EditHeader />
        <div className="flex-auto overflow-hidden">
          <div className="flex h-full">
            {/* 左侧物料面板 */}
            <div className={`w-[355px] h-full overflow-hidden flex flex-col ${
              theme === 'dark' 
                ? 'bg-[#1e1e23] border-r border-white/5' 
                : 'bg-white border-r border-gray-200'
            }`}>
              <LeftPanel />
            </div>
            
            {/* 中间画布区域 */}
            <div
              className={`flex-1 flex justify-center items-center p-6 ${
                theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-gray-100'
              }`}
              onClick={removeSelectedId}
            >
              <div className={`w-[400px] h-[712px] relative overflow-auto shadow-2xl rounded-xl ${
                theme === 'dark' 
                  ? 'bg-white border border-white/10' 
                  : 'bg-white border border-gray-200'
              }`}>
                <div className="h-[800px]">
                  <EditCanvas loading={loading} />
                </div>
              </div>
            </div>
            
            {/* 右侧属性面板 */}
            <div className={`w-[325px] h-full overflow-hidden flex flex-col ${
              theme === 'dark' 
                ? 'bg-[#1e1e23] border-l border-white/5' 
                : 'bg-white border-l border-gray-200'
            }`}>
              <RightPanel />
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default EditQuestionPage
