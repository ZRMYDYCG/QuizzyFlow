import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import useLoadUserData from '../../../../hooks/useLoadUserData.ts'
import { logoutReducer } from '../../../../store/modules/user.ts'
import useGetUserInfo from '../../../../hooks/useGetUserInfo.ts'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { User, Settings, LogOut, Loader2, Bell, Calendar, Clock } from 'lucide-react'
import { useMemo } from 'react'

const ContentHeader = () => {
  const { username, nickname } = useGetUserInfo()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { waitingUserData } = useLoadUserData()

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    dispatch(logoutReducer())
  }

  // 获取问候语
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  // 获取当前日期信息
  const dateInfo = useMemo(() => {
    const now = new Date()
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    
    return {
      dayOfWeek: days[now.getDay()],
      date: `${days[now.getDay()]}, the ${now.getDate()}${getOrdinalSuffix(now.getDate())} of ${months[now.getMonth()]} ${now.getFullYear()}`,
      time: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
  }, [])

  function getOrdinalSuffix(n: number) {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return s[(v - 20) % 10] || s[v] || s[0]
  }

  return (
    <div className="bg-[#1a1d29] border-b border-white/5">
      <div className="px-8 py-6">
        <div className="flex items-start justify-between">
          {/* 左侧问候语区域 */}
          <div>
            {waitingUserData ? (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>加载中...</span>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {greeting}, {nickname || username}!
                </h1>
                <p className="text-slate-400 text-sm italic mb-3">
                  "The final wisdom of life requires not the annulment of incongruity but the achievement of serenity within and above it." - Reinhold Niebuhr
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{dateInfo.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>{dateInfo.time}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 右侧操作区域 */}
          <div className="flex items-center gap-3">
            {/* 通知按钮 */}
            <button className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* 用户菜单 */}
            {!waitingUserData && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {(nickname || username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-white">
                        {nickname || username}
                      </span>
                      <span className="text-xs text-slate-500">管理员</span>
                    </div>
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[200px] bg-[#1a1d29] rounded-xl border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in-0 zoom-in-95"
                    sideOffset={8}
                    align="end"
                  >
                    <DropdownMenu.Item
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 rounded-lg outline-none cursor-pointer hover:bg-white/10 transition-colors"
                      onSelect={() => {
                        // navigate('/profile')
                      }}
                    >
                      <User className="w-4 h-4" />
                      <span>个人中心</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 rounded-lg outline-none cursor-pointer hover:bg-white/10 transition-colors"
                      onSelect={() => {
                        // navigate('/settings')
                      }}
                    >
                      <Settings className="w-4 h-4" />
                      <span>设置</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-white/10 my-2" />

                    <DropdownMenu.Item
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 rounded-lg outline-none cursor-pointer hover:bg-red-500/10 transition-colors"
                      onSelect={logout}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>退出登录</span>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentHeader

