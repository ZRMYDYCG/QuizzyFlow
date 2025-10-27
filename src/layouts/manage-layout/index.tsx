import { Outlet, useNavigate } from 'react-router-dom'
import { ConfigProvider, message } from 'antd'
import Sidebar from './components/sidebar/index.tsx'
import { useGetUserInfo } from '../../hooks/useGetUserInfo'
import { useLogout } from '../../hooks/useLogout'
import { useLoadUserData } from '../../hooks/useLoadUserData'
import { useNavPage } from '../../hooks/useNavPage'
import { useState } from 'react'
import React from 'react'
import { useSelector } from 'react-redux'
import type { stateType } from '@/store'
import { Plus, PanelLeftClose, PanelLeft, ChevronLeft, ChevronRight, Search, Bell, ChevronDown, Loader2, Palette, User } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { createQuestion } from '../../api/modules/question.ts'
import { useRequest } from 'ahooks'
import ThemeToggle from '../../components/ThemeToggle'
import { useTheme } from '../../contexts/ThemeContext'
import { editorDarkTheme, editorLightTheme } from '../../config/theme.config'
import ThemeSelectorDialog from '../../components/theme-selector-dialog'
import { useNavigationHistory } from '@/hooks/useNavigationHistory'

const ManageLayout = () => {
  const { username, nickname } = useGetUserInfo()
  const { logout } = useLogout()
  const { waitingUserData } = useLoadUserData()
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
    // 在移动端控制 mobileSidebarOpen，在桌面端控制 sidebarCollapsed
    if (window.innerWidth < 768) {
      setMobileSidebarOpen(!mobileSidebarOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  // 主题相关的类名
  const themeClasses = {
    bg: theme === 'dark' ? 'bg-[#1a1a1f]' : 'bg-white',
    cardBg: theme === 'dark' ? 'bg-[#1e1e23]' : 'bg-white',
    buttonBg: theme === 'dark' ? 'bg-[#2a2a2f] hover:bg-[#35353a]' : 'bg-gray-100 hover:bg-gray-200',
    border: theme === 'dark' ? 'border-white/5' : 'border-gray-200',
    text: theme === 'dark' ? 'text-slate-300' : 'text-gray-700',
    textSecondary: theme === 'dark' ? 'text-slate-400' : 'text-gray-500',
    inputBg: theme === 'dark' ? 'bg-[#2a2a2f]' : 'bg-gray-50',
    placeholder: theme === 'dark' ? 'placeholder:text-slate-600' : 'placeholder:text-gray-400',
  }

  // 根据主题选择 Ant Design 配置
  const currentTheme = theme === 'dark' ? editorDarkTheme : editorLightTheme

  return (
    <ConfigProvider theme={currentTheme}>
      <div className={`flex h-screen overflow-hidden ${themeClasses.bg}`}>
      {/* 移动端遮罩层 */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in-0 duration-300"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 左侧侧边栏 - 桌面端固定，移动端浮动 */}
      <div 
        className={`
          md:flex-shrink-0 md:transition-all md:duration-300
          ${sidebarCollapsed ? 'md:w-0' : 'md:w-[200px]'}
          fixed md:relative z-50 md:z-auto h-full
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          shadow-2xl md:shadow-none
        `}
      >
        <div className={`h-full w-full ${sidebarCollapsed ? 'md:invisible' : 'md:visible'}`}>
          <Sidebar />
        </div>
      </div>

      {/* 右侧内容区 - 外层容器 */}
      <div 
        className={`
          flex-1 overflow-hidden transition-all duration-300
          p-3
          ${sidebarCollapsed ? 'md:p-3' : 'md:p-[30px]'}
        `}
      >
        {/* 内层圆角边框容器 */}
        <div className={`h-full ${themeClasses.cardBg} rounded-xl md:rounded-2xl border ${themeClasses.border} flex flex-col overflow-hidden transition-all duration-300`}>
          {/* 顶部工具栏 */}
          <div className={`h-14 md:h-16 flex items-center justify-between px-3 md:px-6 border-b ${themeClasses.border}`}>
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              {/* 收起/展开按钮 */}
              <button
                onClick={toggleSidebar}
                className={`w-8 h-8 rounded-lg ${themeClasses.buttonBg} flex items-center justify-center ${themeClasses.textSecondary} hover:text-white transition-colors flex-shrink-0`}
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
                  onClick={goBack}
                  disabled={!canGoBack}
                  className={`w-8 h-8 rounded-lg ${themeClasses.buttonBg} flex items-center justify-center transition-all ${
                    canGoBack 
                      ? `${themeClasses.textSecondary} hover:text-white cursor-pointer hover:shadow-md` 
                      : 'text-gray-400 dark:text-gray-600 opacity-40 cursor-not-allowed'
                  }`}
                  title={canGoBack ? '后退' : '无法后退'}
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                </button>
                <button 
                  onClick={goForward}
                  disabled={!canGoForward}
                  className={`w-8 h-8 rounded-lg ${themeClasses.buttonBg} flex items-center justify-center transition-all ${
                    canGoForward 
                      ? `${themeClasses.textSecondary} hover:text-white cursor-pointer hover:shadow-md` 
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
              {/* 新建按钮 - 移动端只显示图标 */}
              <button 
                onClick={() => handleCreateQuestion()}
                disabled={isCreating}
                className="flex items-center justify-center gap-0 md:gap-2 px-2 md:px-3 h-8 md:h-9 rounded-lg text-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`,
                }}
                onMouseEnter={(e) => {
                  if (!isCreating) {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${themeColors.primaryHover}, ${primaryColor})`
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCreating) {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`
                  }
                }}
              >
                {isCreating ? (
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                ) : (
                  <Plus className="w-4 h-4" strokeWidth={2} />
                )}
              </button>

              {/* 通知按钮 - 移动端隐藏 */}
              <button className={`hidden md:flex relative w-8 h-8 rounded-lg ${themeClasses.buttonBg} items-center justify-center ${themeClasses.textSecondary} hover:text-white transition-colors`}>
                <Bell className="w-4 h-4" strokeWidth={2} />
                <span 
                  className="absolute top-1 right-1 w-2 h-2 rounded-full shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                ></span>
              </button>

              {/* 主题切换按钮 */}
              <ThemeToggle />

              {/* 用户菜单 */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className={`flex items-center gap-1 md:gap-2 pl-1 md:pl-2 pr-2 md:pr-3 h-8 md:h-9 rounded-lg ${themeClasses.buttonBg} transition-colors`}>
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="avatar" 
                        className="w-6 h-6 md:w-7 md:h-7 rounded-lg object-cover shadow-lg"
                      />
                    ) : (
                      <div 
                        className="w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`
                        }}
                      >
                        {(nickname || username || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <ChevronDown className="w-3 h-3 text-slate-500 hidden md:block" strokeWidth={2} />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className={`min-w-[200px] rounded-xl border shadow-2xl p-2 z-50 animate-in fade-in-0 zoom-in-95 ${
                      theme === 'dark' 
                        ? 'bg-[#2a2a2f] border-white/10' 
                        : 'bg-white border-gray-200'
                    }`}
                    sideOffset={8}
                    align="end"
                  >
                    <div className={`px-3 py-2 border-b mb-2 ${
                      theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                    }`}>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {nickname || username}
                      </p>
                      <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                        {username}
                      </p>
                    </div>
                    <DropdownMenu.Item 
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg outline-none cursor-pointer transition-colors ${
                        theme === 'dark' 
                          ? 'text-slate-300 hover:bg-white/10' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onSelect={() => navigate('/profile')}
                    >
                      <User className="w-4 h-4" />
                      <span>个人中心</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item 
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg outline-none cursor-pointer transition-colors ${
                        theme === 'dark' 
                          ? 'text-slate-300 hover:bg-white/10' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onSelect={() => setThemeDialogOpen(true)}
                    >
                      <Palette className="w-4 h-4" />
                      <span className="flex-1">主题颜色</span>
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ 
                          backgroundColor: primaryColor,
                          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                        }}
                      />
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className={`h-px my-2 ${
                      theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                    }`} />
                    <DropdownMenu.Item 
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 rounded-lg outline-none cursor-pointer hover:bg-red-500/10 transition-colors"
                      onSelect={logout}
                    >
                      退出登录
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>

          {/* 主内容区域 */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4 md:p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      
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
