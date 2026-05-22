import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Drawer, Button } from 'antd'
import { LogIn, UserPlus, LayoutDashboard } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { cn } from '@/utils'
import { TEMPLATE_NAV_ITEMS } from '../config'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

const MobileMenu: FC<MobileMenuProps> = ({ open, onClose }) => {
  const navigate = useNavigate()
  const { theme, primaryColor, themeColors } = useTheme()
  const { username, nickname, avatar, token } = useGetUserInfo()

  const handleNavigate = (path: string) => {
    if (path.includes('#')) {
      const [base, hash] = path.split('#')
      navigate(base)
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
      })
    } else {
      navigate(path)
    }
    onClose()
  }

  return (
    <Drawer
      title={null}
      placement="right"
      width={300}
      open={open}
      onClose={onClose}
      className="template-mobile-menu"
      styles={{
        body: { padding: 0 },
        content: {
          background: theme === 'dark' ? '#0f172a' : '#ffffff',
        },
      }}
    >
      <div className="flex h-full flex-col">
        {token && (
          <div
            className={cn(
              'border-b px-5 py-6',
              theme === 'dark' ? 'border-slate-800' : 'border-gray-100'
            )}
          >
            <div className="flex items-center gap-3">
              {avatar ? (
                <img src={avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
              ) : (
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`,
                  }}
                >
                  {(nickname || username || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p
                  className={cn(
                    'font-semibold',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}
                >
                  {nickname || username}
                </p>
                <p className={cn('text-xs', theme === 'dark' ? 'text-slate-500' : 'text-gray-500')}>
                  欢迎回来
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1 px-3 py-4">
          {TEMPLATE_NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavigate(item.path)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors',
                  theme === 'dark'
                    ? 'text-slate-300 hover:bg-slate-800'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}

          {token && (
            <button
              type="button"
              onClick={() => handleNavigate('/manage/list')}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors',
                theme === 'dark'
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              我的工作台
            </button>
          )}
        </nav>

        <div
          className={cn(
            'space-y-2 border-t p-4',
            theme === 'dark' ? 'border-slate-800' : 'border-gray-100'
          )}
        >
          {token ? (
            <Button block type="primary" onClick={() => handleNavigate('/profile')}>
              个人中心
            </Button>
          ) : (
            <>
              <Button
                block
                icon={<LogIn className="h-4 w-4" />}
                onClick={() => handleNavigate('/login')}
              >
                登录
              </Button>
              <Button
                block
                type="primary"
                icon={<UserPlus className="h-4 w-4" />}
                onClick={() => handleNavigate('/register')}
              >
                免费注册
              </Button>
            </>
          )}
        </div>
      </div>
    </Drawer>
  )
}

export default MobileMenu
