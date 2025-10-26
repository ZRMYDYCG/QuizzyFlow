import { useNavigate, useLocation } from 'react-router-dom'
import { createQuestion } from '../../../../api/modules/question.ts'
import { useRequest } from 'ahooks'
import { message } from 'antd'
import { useManageTheme } from '../../../../hooks/useManageTheme.ts'
import { useTheme } from '../../../../contexts/ThemeContext'
import Logo from '@/components/Logo'
import { 
  LayoutDashboard,
  FileText, 
  Star, 
  Trash2,
  Store,
  LucideIcon,
} from 'lucide-react'

// 菜单项类型定义
interface MenuItem {
  key: string
  icon: LucideIcon
  label: string
  onClick: () => void
  badge?: string
}

// 菜单组类型定义
interface MenuGroup {
  title?: string
  items: MenuItem[]
}

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
    if (pathname.startsWith('/template')) return 'template'
    if (pathname === '/manage') return 'dashboard'
    return 'dashboard'
  }

  // 菜单分组
  const menuGroups: MenuGroup[] = [
    {
      title: '问卷管理',
      items: [
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
    },
    {
      title: '扩展功能',
      items: [
        {
          key: 'template',
          icon: Store,
          label: '模板市场',
          onClick: () => navigate('/template/market'),
          badge: 'New',
        }
      ]
    }
  ]

  return (
    <div className={`h-screen flex flex-col py-6 ${
      t.isDark ? 'bg-[#1a1a1f]' : 'bg-white'
    }`}>
      {/* Logo */}
      <div className="px-6 mb-8">
        <Logo size="medium" showText={true} />
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* 分组标题 */}
            {group.title && (
              <div className={`px-3 mb-2 text-xs font-semibold tracking-wide uppercase ${
                t.isDark ? 'text-slate-600' : 'text-gray-400'
              }`}>
                {group.title}
              </div>
            )}
            
            {/* 分组菜单项 */}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = getSelectedKey() === item.key
                return (
                  <button
                    key={item.key}
                    onClick={item.onClick}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative overflow-hidden group/item
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
                      className="w-5 h-5 flex-shrink-0" 
                      strokeWidth={1.5}
                      style={isActive ? { color: primaryColor } : {}}
                    />
                    <span 
                      className="flex-1 text-left"
                      style={isActive ? { color: primaryColor, fontWeight: 600 } : {}}
                    >
                      {item.label}
                    </span>
                    
                    {/* Badge 标识 */}
                    {item.badge && (
                      <span 
                        className="px-1.5 py-0.5 text-[10px] font-bold rounded uppercase"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`,
                          color: 'white'
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* 分隔线 - 不是最后一组时显示 */}
            {groupIndex < menuGroups.length - 1 && (
              <div className={`my-4 mx-3 border-t ${
                t.isDark ? 'border-white/5' : 'border-gray-200'
              }`} />
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar

