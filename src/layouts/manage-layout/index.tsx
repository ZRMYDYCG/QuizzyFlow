import { Outlet, useNavigate } from 'react-router-dom'
import { ConfigProvider, message } from 'antd'
import Sidebar from './components/sidebar/index.tsx'
import useNavPage from '../../hooks/useNavPage.ts'
import useLoadUserData from '../../hooks/useLoadUserData.ts'
import useGetUserInfo from '../../hooks/useGetUserInfo.ts'
import { useState } from 'react'
import { Plus, PanelLeftClose, PanelLeft, ChevronLeft, ChevronRight, Search, Bell, ChevronDown, Loader2 } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { createQuestion } from '../../api/modules/question.ts'
import { useRequest } from 'ahooks'
import ThemeToggle from '../../components/ThemeToggle'
import { useTheme } from '../../contexts/ThemeContext'
import { editorDarkTheme, editorLightTheme } from '../../config/theme.config'

const ManageLayout = () => {
  const { waitingUserData } = useLoadUserData()
  const { username, nickname } = useGetUserInfo()
  useNavPage(waitingUserData)
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // 创建新问卷
  const { loading: isCreating, run: handleCreateQuestion } = useRequest(createQuestion, {
    manual: true,
    onSuccess: async (res) => {
      const { id } = res || {}
      if (id) {
        message.success('问卷创建成功')
        navigate(`/question/edit/${id}`)
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
                <button className={`w-8 h-8 rounded-lg ${themeClasses.buttonBg} flex items-center justify-center ${themeClasses.textSecondary} transition-colors`}>
                  <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                </button>
                <button className={`w-8 h-8 rounded-lg ${themeClasses.buttonBg} flex items-center justify-center ${themeClasses.textSecondary} transition-colors`}>
                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>

              {/* 搜索框 - 移动端隐藏文字 */}
              <div className="relative ml-1 md:ml-2 flex-1 max-w-xs md:max-w-none">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${themeClasses.textSecondary}`} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`w-full md:w-64 h-8 md:h-9 pl-10 pr-4 ${themeClasses.inputBg} border-none rounded-lg text-sm ${themeClasses.text} ${themeClasses.placeholder} focus:outline-none transition-colors`}
                />
              </div>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center gap-1.5 md:gap-3">
              {/* 新建按钮 - 移动端只显示图标 */}
              <button 
                onClick={handleCreateQuestion}
                disabled={isCreating}
                className={`flex items-center justify-center gap-0 md:gap-2 px-2 md:px-3 h-8 md:h-9 rounded-lg ${themeClasses.buttonBg} ${themeClasses.text} hover:text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isCreating ? (
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                ) : (
                  <Plus className="w-4 h-4" strokeWidth={2} />
                )}
              </button>

              {/* 下拉菜单按钮 - 移动端隐藏 */}
              <button className={`hidden md:flex w-8 h-8 rounded-lg ${themeClasses.buttonBg} items-center justify-center ${themeClasses.textSecondary} hover:text-white transition-colors`}>
                <ChevronDown className="w-4 h-4" strokeWidth={2} />
              </button>

              {/* 通知按钮 - 移动端隐藏 */}
              <button className={`hidden md:flex relative w-8 h-8 rounded-lg ${themeClasses.buttonBg} items-center justify-center ${themeClasses.textSecondary} hover:text-white transition-colors`}>
                <Bell className="w-4 h-4" strokeWidth={2} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>

              {/* 主题切换按钮 */}
              <ThemeToggle />

              {/* 用户菜单 */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className={`flex items-center gap-1 md:gap-2 pl-1 md:pl-2 pr-2 md:pr-3 h-8 md:h-9 rounded-lg ${themeClasses.buttonBg} transition-colors`}>
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {(nickname || username || 'U').charAt(0).toUpperCase()}
                    </div>
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
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                        管理员
                      </p>
                    </div>
                    <DropdownMenu.Item className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg outline-none cursor-pointer transition-colors ${
                      theme === 'dark' 
                        ? 'text-slate-300 hover:bg-white/10' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                      个人设置
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 rounded-lg outline-none cursor-pointer hover:bg-red-500/10 transition-colors">
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
      </div>
    </ConfigProvider>
  )
}

export default ManageLayout
