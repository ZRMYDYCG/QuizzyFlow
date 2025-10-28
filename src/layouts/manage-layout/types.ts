export interface IManageLayoutProps {}

export interface IHeaderToolbarProps {
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  isCreating: boolean
  canGoBack: boolean
  canGoForward: boolean
  themeDialogOpen: boolean
  onToggleSidebar: () => void
  onCreateQuestion: () => void
  onGoBack: () => void
  onGoForward: () => void
  onOpenThemeDialog: () => void
}

export interface ISidebarContainerProps {
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
}

export interface IMobileOverlayProps {
  mobileSidebarOpen: boolean
  onClose: () => void
}

export interface IContentWrapperProps {
  sidebarCollapsed: boolean
  children?: React.ReactNode
}