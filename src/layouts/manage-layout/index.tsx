import React, { useState } from 'react'
import { useLoadUserData } from '@/hooks/useLoadUserData'
import { useNavPage } from '@/hooks/useNavPage'
import { useNavigationHistory } from '@/hooks/useNavigationHistory'
import ThemeSelectorDialog from '@/components/theme-selector-dialog'
import MobileOverlay from './components/mobile-overlay'
import SidebarContainer from './components/sidebar-container'
import HeaderToolbar from './components/header-toolbar'
import ContentWrapper from './components/content-wrapper'

const ManageLayout: React.FC = () => {
  const { waitingUserData } = useLoadUserData()

  useNavPage(waitingUserData)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [themeDialogOpen, setThemeDialogOpen] = useState(false)

  const { canGoBack, canGoForward, goBack, goForward } = useNavigationHistory()

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileSidebarOpen(!mobileSidebarOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#1a1a1f]">
      <MobileOverlay
        mobileSidebarOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <SidebarContainer
        sidebarCollapsed={sidebarCollapsed}
        mobileSidebarOpen={mobileSidebarOpen}
      />

      <ContentWrapper sidebarCollapsed={sidebarCollapsed}>
        <HeaderToolbar
          sidebarCollapsed={sidebarCollapsed}
          mobileSidebarOpen={mobileSidebarOpen}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          themeDialogOpen={themeDialogOpen}
          onToggleSidebar={toggleSidebar}
          onGoBack={goBack}
          onGoForward={goForward}
          onOpenThemeDialog={() => setThemeDialogOpen(true)}
        />
      </ContentWrapper>

      <ThemeSelectorDialog
        open={themeDialogOpen}
        onOpenChange={setThemeDialogOpen}
      />
    </div>
  )
}

export default ManageLayout
