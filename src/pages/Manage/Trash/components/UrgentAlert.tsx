import { FC, useMemo } from 'react'
import { AlertTriangle, Clock, Database, RefreshCw } from 'lucide-react'

interface UrgentAlertProps {
  questions: any[]
  onRestoreAll: () => void
  autoDeleteDays?: number
}

const UrgentAlert: FC<UrgentAlertProps> = ({ questions, onRestoreAll, autoDeleteDays = 30 }) => {
  // 计算即将清理的问卷（删除后27天及以上）
  const urgentQuestions = useMemo(() => {
    const now = new Date().getTime()
    return questions.filter(q => {
      if (!q.deletedAt) return false
      const deletedTime = new Date(q.deletedAt).getTime()
      const daysAgo = Math.floor((now - deletedTime) / (1000 * 60 * 60 * 24))
      return daysAgo >= autoDeleteDays - 3 // 最后3天
    })
  }, [questions, autoDeleteDays])

  // 计算高价值数据
  const highValueCount = useMemo(() => {
    return urgentQuestions.reduce((sum, q) => sum + (q.answerCount || 0), 0)
  }, [urgentQuestions])

  if (urgentQuestions.length === 0) return null

  return (
    <div className="p-5 rounded-xl bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-500/50 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        {/* 警告图标 */}
        <div className="flex-shrink-0 p-3 rounded-lg bg-red-500/20 animate-pulse">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            ⚠️ 紧急提醒
          </h3>
          
          <div className="space-y-2 mb-4">
            <p className="text-sm text-slate-300">
              <Clock className="w-4 h-4 inline mr-1" />
              <span className="font-semibold text-red-400">{urgentQuestions.length}</span> 个问卷将在 
              <span className="font-semibold text-red-400"> 3 天内</span> 自动清理
            </p>
            
            {highValueCount > 0 && (
              <p className="text-sm text-slate-300">
                <Database className="w-4 h-4 inline mr-1" />
                包含重要数据：<span className="font-semibold text-yellow-400">{highValueCount}</span> 答卷
              </p>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onRestoreAll}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              立即恢复全部
            </button>
            
            <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-all text-sm">
              查看详情
            </button>
          </div>
        </div>
      </div>

      {/* 问卷列表预览 */}
      <div className="mt-4 pt-4 border-t border-red-500/20">
        <p className="text-xs text-slate-500 mb-2">即将清理的问卷：</p>
        <div className="space-y-1">
          {urgentQuestions.slice(0, 3).map((q: any) => (
            <div key={q._id} className="text-sm text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="truncate flex-1">{q.title}</span>
              <span className="text-xs text-red-400">{q.answerCount || 0} 答卷</span>
            </div>
          ))}
          {urgentQuestions.length > 3 && (
            <p className="text-xs text-slate-500">还有 {urgentQuestions.length - 3} 个...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default UrgentAlert

