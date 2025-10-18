import { useNavigate, useLocation } from 'react-router-dom'
import { createQuestion } from '../../../../api/modules/question.ts'
import { useRequest } from 'ahooks'
import { message } from 'antd'
import { 
  Home,
  FileText, 
  Star, 
  Trash2, 
  Calendar,
  Plus,
  Loader2
} from 'lucide-react'
import useLoadQuestionListData from '../../../../hooks/useLoadQuestionListData'

const Sidebar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

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

  // 获取统计数据
  const { data: allData = {} } = useLoadQuestionListData({})
  const { data: starData = {} } = useLoadQuestionListData({ isStar: true })
  const { data: trashData = {} } = useLoadQuestionListData({ isDeleted: true })

  const getSelectedKey = () => {
    if (pathname.startsWith('/manage/list')) return 'list'
    if (pathname.startsWith('/manage/star')) return 'star'
    if (pathname.startsWith('/manage/trash')) return 'trash'
    return 'list'
  }

  const navItems = [
    {
      key: 'home',
      icon: Home,
      label: '首页',
      onClick: () => navigate('/manage/list'),
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

  const modules = [
    {
      emoji: '🎨',
      label: '问卷模板',
      count: 0,
      color: 'text-pink-400',
      onClick: () => {},
    },
    {
      emoji: '⚙️',
      label: '问卷设置',
      count: 0,
      color: 'text-gray-400',
      onClick: () => {},
    },
    {
      emoji: '🗄️',
      label: '数据统计',
      count: 0,
      color: 'text-emerald-400',
      onClick: () => {},
    },
  ]

  return (
    <div className="h-screen bg-[#1a1a1f] flex flex-col py-6">
      {/* Logo */}
      <div className="px-6 mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center p-1">
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
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${
                  isActive
                    ? 'text-white bg-white/5'
                    : 'text-slate-500 hover:text-slate-300'
                }
              `}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Modules 部分 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-4">
          <div className="flex items-center justify-between px-3 mb-3">
            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Modules</h3>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:text-slate-400 hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              )}
            </button>
          </div>

          <div className="space-y-0.5">
            {modules.map((module, index) => (
              <button
                key={index}
                onClick={module.onClick}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors group"
              >
                <span className="text-base">{module.emoji}</span>
                <span className="flex-1 text-left">{module.label}</span>
                {module.count > 0 && (
                  <span className="text-xs text-slate-600 group-hover:text-slate-500">
                    {module.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

