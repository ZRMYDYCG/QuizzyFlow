import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, User, Palette } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useSelector } from 'react-redux'
import type { stateType } from '@/store'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { useLogout } from '@/hooks/useLogout'
import { usePermission } from '@/hooks/usePermission'
import { useTheme } from '@/contexts/ThemeContext'

interface IUserMenuDropdownProps {
  onOpenThemeDialog: () => void
}

const UserMenuDropdown: React.FC<IUserMenuDropdownProps> = ({ 
  onOpenThemeDialog 
}) => {
  const navigate = useNavigate()
  const { username, nickname } = useGetUserInfo()
  const { logout } = useLogout()
  const { isAdmin } = usePermission()
  const user = useSelector((state: stateType) => state.user)
  const { primaryColor, themeColors } = useTheme()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-1 md:gap-2 pl-1 md:pl-2 pr-2 md:pr-3 h-8 md:h-9 rounded-lg bg-gray-100 dark:bg-[#2a2a2f] hover:bg-gray-200 dark:hover:bg-[#35353a] transition-colors">
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
          className="min-w-[200px] rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2a2a2f] shadow-2xl p-2 z-50 animate-in fade-in-0 zoom-in-95"
          sideOffset={8}
          align="end"
        >
          <div className="px-3 py-2 border-b border-gray-200 dark:border-white/10 mb-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {nickname || username}
            </p>
            <p className="text-xs mt-0.5 text-gray-500 dark:text-slate-400">
              {username}
            </p>
          </div>
          <DropdownMenu.Item 
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg outline-none cursor-pointer transition-colors text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10"
            onSelect={() => navigate('/profile')}
          >
            <User className="w-4 h-4" />
            <span>个人中心</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item 
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg outline-none cursor-pointer transition-colors text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10"
            onSelect={onOpenThemeDialog}
          >
            <Palette className="w-4 h-4" />
            <span className="flex-1">主题颜色</span>
            <div 
              className="w-4 h-4 rounded-full border border-black/10 dark:border-white/20"
              style={{ 
                backgroundColor: primaryColor,
              }}
            />
          </DropdownMenu.Item>
          
          {isAdmin() && (
            <>
              <DropdownMenu.Separator className="h-px my-2 bg-gray-200 dark:bg-white/10" />
              <DropdownMenu.Item 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg outline-none cursor-pointer transition-colors text-blue-500 hover:bg-blue-500/10 font-medium"
                onSelect={() => navigate('/admin/dashboard')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>管理后台</span>
              </DropdownMenu.Item>
            </>
          )}
          
          <DropdownMenu.Separator className="h-px my-2 bg-gray-200 dark:bg-white/10" />
          <DropdownMenu.Item 
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 rounded-lg outline-none cursor-pointer hover:bg-red-500/10 transition-colors"
            onSelect={logout}
          >
            退出登录
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default UserMenuDropdown