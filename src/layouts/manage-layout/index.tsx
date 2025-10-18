import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar/index.tsx'
import useNavPage from '../../hooks/useNavPage.ts'
import useLoadUserData from '../../hooks/useLoadUserData.ts'
import useGetUserInfo from '../../hooks/useGetUserInfo.ts'
import { useState } from 'react'
import { Plus, PanelLeftClose, PanelLeft, ChevronLeft, ChevronRight, Search, Bell, ChevronDown } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

const ManageLayout = () => {
  const { waitingUserData } = useLoadUserData()
  const { username, nickname } = useGetUserInfo()
  useNavPage(waitingUserData)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[#1a1a1f]">
      {/* 左侧侧边栏 */}
      <div 
        className={`flex-shrink-0 transition-all duration-300 ${
          sidebarCollapsed ? 'w-0' : 'w-[200px]'
        }`}
      >
        <div className={`h-full ${sidebarCollapsed ? 'invisible' : 'visible'}`}>
          <Sidebar />
        </div>
      </div>

      {/* 右侧内容区 - 外层容器 */}
      <div 
        className={`flex-1 overflow-hidden transition-all duration-300 ${
          sidebarCollapsed ? 'p-3' : 'p-[80px]'
        }`}
      >
        {/* 内层圆角边框容器 */}
        <div className="h-full bg-[#1e1e23] rounded-2xl border border-white/5 flex flex-col overflow-hidden transition-all duration-300">
          {/* 顶部工具栏 */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              {/* 收起/展开按钮 */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-8 h-8 rounded-lg bg-[#2a2a2f] hover:bg-[#35353a] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                title={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
              >
                {sidebarCollapsed ? (
                  <PanelLeft className="w-4 h-4" strokeWidth={2} />
                ) : (
                  <PanelLeftClose className="w-4 h-4" strokeWidth={2} />
                )}
              </button>

              {/* 后退/前进按钮 */}
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg bg-[#2a2a2f] hover:bg-[#35353a] flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors">
                  <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-[#2a2a2f] hover:bg-[#35353a] flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors">
                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>

              {/* 搜索框 */}
              <div className="relative ml-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Modules, notebooks, tasks..."
                  className="w-64 h-9 pl-10 pr-4 bg-[#2a2a2f] border-none rounded-lg text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:bg-[#35353a] transition-colors"
                />
              </div>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center gap-3">
              {/* 新建按钮 */}
              <button className="flex items-center gap-2 px-3 h-9 rounded-lg bg-[#2a2a2f] hover:bg-[#35353a] text-slate-300 hover:text-white text-sm transition-colors">
                <Plus className="w-4 h-4" strokeWidth={2} />
              </button>

              {/* 下拉菜单按钮 */}
              <button className="w-8 h-8 rounded-lg bg-[#2a2a2f] hover:bg-[#35353a] flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronDown className="w-4 h-4" strokeWidth={2} />
              </button>

              {/* 通知按钮 */}
              <button className="relative w-8 h-8 rounded-lg bg-[#2a2a2f] hover:bg-[#35353a] flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <Bell className="w-4 h-4" strokeWidth={2} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>

              {/* 用户菜单 */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-2 pl-2 pr-3 h-9 rounded-lg bg-[#2a2a2f] hover:bg-[#35353a] transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {(nickname || username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-500" strokeWidth={2} />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[200px] bg-[#2a2a2f] rounded-xl border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in-0 zoom-in-95"
                    sideOffset={8}
                    align="end"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-2">
                      <p className="text-sm font-medium text-white">{nickname || username}</p>
                      <p className="text-xs text-slate-500">管理员</p>
                    </div>
                    <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 rounded-lg outline-none cursor-pointer hover:bg-white/10 transition-colors">
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
            <div className="p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageLayout
