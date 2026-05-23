import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '@/components/Logo'
import { useTheme } from '@/contexts/ThemeContext'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { cn } from '@/utils'

const TemplateHeader: FC = () => {
  const navigate = useNavigate()
  const { theme, primaryColor, themeColors } = useTheme()
  const { username, nickname, avatar, token } = useGetUserInfo()

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b backdrop-blur-xl',
        theme === 'dark'
          ? 'border-slate-800/80 bg-slate-950/75'
          : 'border-gray-200/80 bg-white/75'
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Logo size="small" showText onClick={() => navigate('/')} />

          <nav className="hidden items-center gap-6 sm:flex">
            <button
              type="button"
              onClick={() => navigate('/')}
              className={cn(
                'text-sm font-medium transition-colors',
                theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              首页
            </button>
          </nav>
        </div>

        {token ? (
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className={cn(
              'flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 transition-colors',
              theme === 'dark'
                ? 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/60'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            {avatar ? (
              <img src={avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`,
                }}
              >
                {(nickname || username || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <span
              className={cn(
                'hidden max-w-[6rem] truncate text-sm font-medium sm:inline',
                theme === 'dark' ? 'text-slate-200' : 'text-gray-700'
              )}
            >
              {nickname || username}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              theme === 'dark'
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            登录
          </button>
        )}
      </div>
    </header>
  )
}

export default TemplateHeader
