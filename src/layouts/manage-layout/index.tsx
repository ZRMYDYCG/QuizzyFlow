import React, { useState } from 'react'
import { ConfigProvider, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { stateType } from '@/store'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { useLogout } from '@/hooks/useLogout'
import { useLoadUserData } from '@/hooks/useLoadUserData'
import { useNavPage } from '@/hooks/useNavPage'
import { usePermission } from '@/hooks/usePermission'
import { useNavigationHistory } from '@/hooks/useNavigationHistory'
import { useRequest } from 'ahooks'
import { createQuestion } from '@/api/modules/question'
import { editorDarkTheme, editorLightTheme } from '@/config/theme.config'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeSelectorDialog from '@/components/theme-selector-dialog'
import MobileOverlay from './components/mobile-overlay'
import SidebarContainer from './components/sidebar-container'
import HeaderToolbar from './components/header-toolbar'
import ContentWrapper from './components/content-wrapper'

const ManageLayout: React.FC = () => {
  const { username } = useGetUserInfo()
  const { logout } = useLogout()
  const { waitingUserData } = useLoadUserData()
  const { isAdmin } = usePermission()
  const user = useSelector((state: stateType) => state.user)
  const navigate = useNavigate()
  
  // 路由拦截（只处理非 admin 路径）
  useNavPage(waitingUserData)
  const { theme, primaryColor, themeColors } = useTheme()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [themeDialogOpen, setThemeDialogOpen] = useState(false)

  // 导航历史记录（前进/后退）
  const { canGoBack, canGoForward, goBack, goForward } = useNavigationHistory()

  // 创建新问卷
  const { loading: isCreating, run: handleCreateQuestion } = useRequest(createQuestion, {
    manual: true,
    onSuccess: async (res) => {
      const { _id } = res || {}
      if (_id) {
        message.success('问卷创建成功')
        navigate(`/question/edit/${_id}`)
      }
    },
  })

  // 切换侧边栏状态
  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileSidebarOpen(!mobileSidebarOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  // 根据主题选择 Ant Design 配置
  const currentTheme = theme === 'dark' ? editorDarkTheme : editorLightTheme

  return (
    <ConfigProvider theme={currentTheme}>
      <div className="flex h-screen overflow-hidden bg-white dark:bg-[#1a1a1f]">
        {/* 移动端遮罩层 */}
        <MobileOverlay 
          mobileSidebarOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* 左侧侧边栏 */}
        <SidebarContainer 
          sidebarCollapsed={sidebarCollapsed}
          mobileSidebarOpen={mobileSidebarOpen}
        />

        {/* 右侧内容区 */}
        <ContentWrapper sidebarCollapsed={sidebarCollapsed}>
          <HeaderToolbar
            sidebarCollapsed={sidebarCollapsed}
            mobileSidebarOpen={mobileSidebarOpen}
            isCreating={isCreating}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            themeDialogOpen={themeDialogOpen}
            onToggleSidebar={toggleSidebar}
            onCreateQuestion={handleCreateQuestion}
            onGoBack={goBack}
            onGoForward={goForward}
            onOpenThemeDialog={() => setThemeDialogOpen(true)}
          />
        </ContentWrapper>
        
        {/* 主题选择对话框 */}
        <ThemeSelectorDialog 
          open={themeDialogOpen} 
          onOpenChange={setThemeDialogOpen}
        />
      </div>
    </ConfigProvider>
  )
}

export default ManageLayout