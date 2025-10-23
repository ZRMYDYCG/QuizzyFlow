import { FC, useMemo } from 'react'
import { Lightbulb, Download, Trash2, RefreshCw, AlertCircle } from 'lucide-react'
import { useManageTheme } from '@/hooks/useManageTheme'

interface SmartSuggestionsProps {
  questions: any[]
  onAction?: (action: string, ids: string[]) => void
}

const SmartSuggestions: FC<SmartSuggestionsProps> = ({ questions, onAction }) => {
  const t = useManageTheme()
  // 分析并生成建议
  const suggestions = useMemo(() => {
    const result = []
    
    // 高价值数据建议
    const highValueQuestions = questions.filter(q => (q.answerCount || 0) >= 50)
    if (highValueQuestions.length > 0) {
      result.push({
        icon: Download,
        type: 'export',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        title: '建议导出高价值数据',
        description: `${highValueQuestions.length} 个问卷含有大量数据（≥50答卷），建议导出后再删除`,
        action: '导出数据',
        actionColor: 'bg-blue-500 hover:bg-blue-600',
        questionIds: highValueQuestions.map(q => q._id),
      })
    }

    // 草稿清理建议
    const draftQuestions = questions.filter(q => !q.isPublished && (q.answerCount || 0) === 0)
    if (draftQuestions.length > 0) {
      result.push({
        icon: Trash2,
        type: 'clean-drafts',
        color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
        title: '安全清理未使用草稿',
        description: `${draftQuestions.length} 个未发布且无数据的草稿可以安全清理`,
        action: '批量清理',
        actionColor: 'bg-slate-600 hover:bg-slate-700',
        questionIds: draftQuestions.map(q => q._id),
      })
    }

    // 低价值问卷建议
    const lowValueQuestions = questions.filter(q => 
      q.isPublished && (q.answerCount || 0) > 0 && (q.answerCount || 0) < 10
    )
    if (lowValueQuestions.length > 0) {
      result.push({
        icon: AlertCircle,
        type: 'review',
        color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
        title: '建议复查低价值问卷',
        description: `${lowValueQuestions.length} 个问卷答卷数较少（<10），可考虑清理或恢复改进`,
        action: '查看详情',
        actionColor: 'bg-orange-500 hover:bg-orange-600',
        questionIds: lowValueQuestions.map(q => q._id),
      })
    }

    // 即将清理的重要数据
    const now = new Date().getTime()
    const urgentHighValue = questions.filter(q => {
      if (!q.deletedAt || (q.answerCount || 0) < 20) return false
      const daysAgo = Math.floor((now - new Date(q.deletedAt).getTime()) / (1000 * 60 * 60 * 24))
      return daysAgo >= 27
    })
    if (urgentHighValue.length > 0) {
      result.push({
        icon: RefreshCw,
        type: 'restore-urgent',
        color: 'text-red-400 bg-red-500/10 border-red-500/20',
        title: '紧急恢复重要数据',
        description: `${urgentHighValue.length} 个包含数据的问卷即将自动清理，建议立即恢复`,
        action: '立即恢复',
        actionColor: 'bg-emerald-500 hover:bg-emerald-600',
        questionIds: urgentHighValue.map(q => q._id),
        isUrgent: true,
      })
    }

    return result
  }, [questions])

  if (suggestions.length === 0) {
    return (
      <div className={`p-5 rounded-xl border text-center ${
        t.isDark 
          ? 'bg-slate-800/30 border-slate-700/50' 
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <Lightbulb className={`w-12 h-12 mx-auto mb-2 ${t.text.tertiary}`} />
        <p className={`text-sm ${t.text.secondary}`}>暂无智能建议</p>
        <p className={`text-xs mt-1 ${t.text.tertiary}`}>回收站数据正常 ✨</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        <h3 className={`text-lg font-semibold ${t.text.primary}`}>智能建议</h3>
      </div>

      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon
        return (
          <div
            key={index}
            className={`
              p-4 rounded-xl border transition-all
              ${suggestion.isUrgent 
                ? t.isDark 
                  ? 'bg-red-900/10 border-red-500/30' 
                  : 'bg-red-50 border-red-300'
                : t.isDark
                  ? 'bg-slate-800/30 border-slate-700/50'
                  : 'bg-white border-gray-200 shadow-sm'
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* 图标 */}
              <div className={`flex-shrink-0 p-2 rounded-lg border ${suggestion.color}`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-semibold mb-1 ${t.text.primary}`}>
                  {suggestion.title}
                </h4>
                <p className={`text-xs mb-3 ${t.text.secondary}`}>
                  {suggestion.description}
                </p>

                {/* 操作按钮 */}
                <button
                  onClick={() => onAction?.(suggestion.type, suggestion.questionIds)}
                  className={`
                    px-3 py-1.5 text-xs text-white rounded-lg transition-all font-medium
                    ${suggestion.actionColor}
                  `}
                >
                  {suggestion.action}
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SmartSuggestions

