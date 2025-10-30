import { Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'
import { Button } from 'antd'
import { ArrowLeft, User, Home } from 'lucide-react'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'

const TemplateLayout = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { username, token } = useGetUserInfo()

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* 顶部导航栏 */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${
        theme === 'dark' 
          ? 'bg-slate-900/80 border-slate-800' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 左侧 - Logo 和返回按钮 */}
            <div className="flex items-center gap-4">
              <Logo size="small" showText={true} />
              
              <div className={`h-6 w-px ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'
              }`} />
              
              <Button
                type="text"
                icon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate('/manage/list')}
                className="flex items-center gap-2"
              >
                返回管理后台
              </Button>
            </div>

            {/* 右侧 - 用户信息和操作 */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              
              {token ? (
                <>
                  <Button
                    type="text"
                    icon={<Home className="w-4 h-4" />}
                    onClick={() => navigate('/manage')}
                  >
                    我的问卷
                  </Button>
                  <Button
                    type="primary"
                    icon={<User className="w-4 h-4" />}
                    onClick={() => navigate('/profile')}
                  >
                    {username}
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => navigate('/login')}>
                    登录
                  </Button>
                  <Button type="primary" onClick={() => navigate('/register')}>
                    注册
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main>
        <Outlet />
      </main>

      {/* 底部 */}
      <footer className={`mt-20 border-t ${
        theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <p className={`text-sm ${
              theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
            }`}>
              © 2024 QuizzyFlow. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a 
                href="/terms" 
                target="_blank"
                className={`text-sm hover:underline ${
                  theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                服务条款
              </a>
              <a 
                href="/privacy" 
                target="_blank"
                className={`text-sm hover:underline ${
                  theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                隐私政策
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default TemplateLayout