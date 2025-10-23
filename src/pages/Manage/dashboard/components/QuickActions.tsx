import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { message } from 'antd'
import { createQuestion } from '@/api/modules/question'
import { useManageTheme } from '@/hooks/useManageTheme'
import { 
  Plus,
  FileText,
  Star,
  Trash2,
  BarChart3,
  Zap,
} from 'lucide-react'

const QuickActions: FC = () => {
  const navigate = useNavigate()
  const t = useManageTheme()

  const { loading, run: handleCreate } = useRequest(createQuestion, {
    manual: true,
    onSuccess: async (res) => {
      const { _id } = res || {}
      if (_id) {
        navigate(`/question/edit/${_id}`)
        message.success('创建成功')
      }
    },
  })

  const actions = [
    {
      icon: Plus,
      label: '新建问卷',
      description: '创建一个新问卷',
      color: 'blue',
      onClick: () => handleCreate(),
      loading,
    },
    {
      icon: FileText,
      label: '问卷列表',
      description: '查看所有问卷',
      color: 'purple',
      onClick: () => navigate('/manage/list'),
    },
    {
      icon: Star,
      label: '星标问卷',
      description: '查看收藏的问卷',
      color: 'yellow',
      onClick: () => navigate('/manage/star'),
    },
    {
      icon: Trash2,
      label: '回收站',
      description: '管理已删除问卷',
      color: 'red',
      onClick: () => navigate('/manage/trash'),
    },
  ]

  return (
    <div className={`p-5 rounded-xl border ${
      t.isDark 
        ? 'bg-gradient-to-br from-slate-800/80 to-slate-800/40 border-slate-700/50' 
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-400" />
        <h3 className={`text-base md:text-lg font-semibold ${t.text.primary}`}>
          快速操作
        </h3>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-2">
        {actions.map((action, index) => {
          const Icon = action.icon
          const colorClass = {
            blue: 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20',
            purple: 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20',
            yellow: 'text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/20',
            red: 'text-red-400 bg-red-500/10 hover:bg-red-500/20 border-red-500/20',
          }[action.color]

          return (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.loading}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${colorClass} ${
                action.loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex-shrink-0">
                <Icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <div className={`text-sm font-medium ${t.text.primary}`}>
                  {action.label}
                </div>
                <div className={`text-xs ${t.text.tertiary}`}>
                  {action.description}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions

