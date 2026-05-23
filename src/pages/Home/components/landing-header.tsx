import { FC, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { LayoutDashboard, LogOut, Shield, Store, User } from 'lucide-react'
import UserChatAvatar from '@/components/user-chat-avatar'
import ThemeSelectorDialog from '@/components/theme-selector-dialog'
import { useTheme } from '@/contexts/ThemeContext'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { useLogout } from '@/hooks/useLogout'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/utils'

const LandingHeader: FC = () => {
  const navigate = useNavigate()
  const { theme, primaryColor, themeColors } = useTheme()
  const { token, nickname, username, role, grantedRoutes } = useGetUserInfo()
  const { logout } = useLogout()
  const { isAdmin } = usePermission()
  const [themeDialogOpen, setThemeDialogOpen] = useState(false)

  const menuItems = useMemo<MenuProps['items']>(() => {
    const items: MenuProps['items'] = [
      {
        key: 'manage',
        icon: <LayoutDashboard className="h-4 w-4" />,
        label: '工作台',
        onClick: () => navigate('/manage'),
      },
      {
        key: 'profile',
        icon: <User className="h-4 w-4" />,
        label: '个人中心',
        onClick: () => navigate('/profile'),
      },
      {
        key: 'market',
        icon: <Store className="h-4 w-4" />,
        label: '模板市场',
        onClick: () => navigate('/template/market'),
      },
    ]

    if (isAdmin()) {
      items.push({
        key: 'admin',
        icon: <Shield className="h-4 w-4" />,
        label: '管理后台',
        onClick: () => navigate('/admin/dashboard'),
      })
    }

    items.push(
      { type: 'divider' },
      {
        key: 'theme',
        label: '主题颜色',
        onClick: () => setThemeDialogOpen(true),
      },
      {
        key: 'logout',
        icon: <LogOut className="h-4 w-4" />,
        label: '退出登录',
        danger: true,
        onClick: logout,
      }
    )

    return items
  }, [isAdmin, logout, navigate, role, grantedRoutes])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 backdrop-blur-xl',
          theme === 'dark' ? 'bg-slate-950/75' : 'bg-white/75'
        )}
      >
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-end gap-2 px-4 sm:px-6">
          {token ? (
            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-2 transition-colors hover:opacity-90"
                style={{
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                }}
              >
                <UserChatAvatar size={32} />
                <span
                  className={cn(
                    'hidden max-w-[6rem] truncate text-sm font-medium sm:inline',
                    theme === 'dark' ? 'text-slate-200' : 'text-gray-700'
                  )}
                >
                  {nickname || username}
                </span>
              </button>
            </Dropdown>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  theme === 'dark'
                    ? 'text-slate-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                登录
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="rounded-full px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`,
                }}
              >
                注册
              </button>
            </>
          )}
        </div>
      </header>

      <ThemeSelectorDialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen} />
    </>
  )
}

export default LandingHeader
