import { useNavigate, useLocation } from 'react-router-dom'
import { createQuestion } from '../../../../api/modules/question.ts'
import { useRequest } from 'ahooks'
import { message } from 'antd'
import { useManageTheme } from '../../../../hooks/useManageTheme.ts'
import { useTheme } from '../../../../contexts/ThemeContext'
import { 
  LayoutDashboard,
  FileText, 
  Star, 
  Trash2,
} from 'lucide-react'

const Sidebar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const t = useManageTheme()
  const { primaryColor, themeColors } = useTheme()

  const { loading, run: handleCreate } = useRequest(createQuestion, {
    manual: true,
    onSuccess: async (res) => {
      const { id } = res || {}
      if (id) {
        navigate(`/question/edit/${id}`)
        message.success('创建成功')
      }
    },
  })

  const getSelectedKey = () => {
    if (pathname.startsWith('/manage/list')) return 'list'
    if (pathname.startsWith('/manage/star')) return 'star'
    if (pathname.startsWith('/manage/trash')) return 'trash'
    if (pathname === '/manage') return 'dashboard'
    return 'dashboard'
  }

  const navItems = [
    {
      key: 'dashboard',
      icon: LayoutDashboard,
      label: '仪表盘',
      onClick: () => navigate('/manage'),
    },
    {
      key: 'list',
      icon: FileText,
      label: '问卷列表',
      onClick: () => navigate('/manage/list'),
    },
    {
      key: 'star',
      icon: Star,
      label: '星标问卷',
      onClick: () => navigate('/manage/star'),
    },
    {
      key: 'trash',
      icon: Trash2,
      label: '回收站',
      onClick: () => navigate('/manage/trash'),
    }
  ]

  return (
    <div className={`h-screen flex flex-col py-6 ${
      t.isDark ? 'bg-[#1a1a1f]' : 'bg-white'
    }`}>
      {/* Logo */}
      <div className="px-6 mb-8">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center p-1 shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`
          }}
        >
          <img src="/vite.svg" alt="logo" />
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="px-4 mb-8">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = getSelectedKey() === item.key
          return (
            <button
              key={item.key}
              onClick={item.onClick}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative overflow-hidden
                ${
                  isActive
                    ? 'text-white'
                    : t.isDark
                      ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
              style={isActive ? {
                background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}25)`,
                borderLeft: `3px solid ${primaryColor}`,
                paddingLeft: '9px'
              } : {}}
            >
              <Icon 
                className="w-5 h-5" 
                strokeWidth={1.5}
                style={isActive ? { color: primaryColor } : {}}
              />
              <span style={isActive ? { color: primaryColor, fontWeight: 600 } : {}}>
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar

