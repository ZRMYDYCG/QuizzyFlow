import React from 'react'
import { Outlet } from 'react-router-dom'
import { PanelLeftClose, PanelLeft, ChevronLeft, ChevronRight, Bell } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'
import CreateButton from '../create-button'
import UserMenuDropdown from '../user-menu-dropdown'
import type { IHeaderToolbarProps } from '../../types'

const HeaderToolbar: React.FC<IHeaderToolbarProps> = ({
  sidebarCollapsed,
  mobileSidebarOpen,
  canGoBack,
  canGoForward,
  themeDialogOpen,
  onToggleSidebar,
  onGoBack,
  onGoForward,
  onOpenThemeDialog,
}) => {
  const { primaryColor } = useTheme()

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 顶部工具栏 */}
      <div className="h-14 md:h-16 flex items-center justify-between px-3 md:px-6 border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          {/* 收起/展开按钮 */}
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#2a2a2f] hover:bg-gray-200 dark:hover:bg-[#35353a] flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-white transition-colors flex-shrink-0"
            title={sidebarCollapsed || !mobileSidebarOpen ? '展开侧边栏' : '收起侧边栏'}
          >
            {(sidebarCollapsed && window.innerWidth >= 768) || (!mobileSidebarOpen && window.innerWidth < 768) ? (
              <PanelLeft className="w-4 h-4" strokeWidth={2} />
            ) : (
              <PanelLeftClose className="w-4 h-4" strokeWidth={2} />
            )}
          </button>

          {/* 后退/前进按钮 - 移动端隐藏 */}
          <div className="hidden md:flex items-center gap-1">
            <button 
              onClick={onGoBack}
              disabled={!canGoBack}
              className={`w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#2a2a2f] hover:bg-gray-200 dark:hover:bg-[#35353a] flex items-center justify-center transition-all ${
                canGoBack 
                  ? 'text-gray-500 dark:text-slate-400 hover:text-white cursor-pointer hover:shadow-md' 
                  : 'text-gray-400 dark:text-gray-600 opacity-40 cursor-not-allowed'
              }`}
              title={canGoBack ? '后退' : '无法后退'}
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            </button>
            <button 
              onClick={onGoForward}
              disabled={!canGoForward}
              className={`w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#2a2a2f] hover:bg-gray-200 dark:hover:bg-[#35353a] flex items-center justify-center transition-all ${
                canGoForward 
                  ? 'text-gray-500 dark:text-slate-400 hover:text-white cursor-pointer hover:shadow-md' 
                  : 'text-gray-400 dark:text-gray-600 opacity-40 cursor-not-allowed'
              }`}
              title={canGoForward ? '前进' : '无法前进'}
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-1.5 md:gap-3">
          <CreateButton />
          
          {/* 通知按钮 - 移动端隐藏 */}
          <button className="hidden md:flex relative w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#2a2a2f] hover:bg-gray-200 dark:hover:bg-[#35353a] items-center justify-center text-gray-500 dark:text-slate-400 hover:text-white transition-colors">
            <Bell className="w-4 h-4" strokeWidth={2} />
            <span 
              className="absolute top-1 right-1 w-2 h-2 rounded-full shadow-lg"
              style={{ backgroundColor: primaryColor }}
            />
          </button>

          <ThemeToggle />
          <UserMenuDropdown onOpenThemeDialog={onOpenThemeDialog} />
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default HeaderToolbar