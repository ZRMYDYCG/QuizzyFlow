import { FC } from 'react'
import { AlertCircle, TrendingDown, Clock, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AttentionNeededProps {
  questions: any[]
}

const AttentionNeeded: FC<AttentionNeededProps> = ({ questions }) => {
  // 筛选需要关注的问卷：已发布但答卷数低的，或者未发布的
  const needAttention = questions.filter(q => {
    if (!q.isPublish) return true // 未发布的草稿
    if (q.answerCount < 10) return true // 答卷数太少
    return false
  }).slice(0, 3)

  if (needAttention.length === 0) return null

  const getAlertType = (question: any) => {
    if (!question.isPublish) {
      return {
        type: 'draft',
        icon: Clock,
        color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
        label: '待发布草稿',
        message: '问卷尚未发布，记得完成后发布哦'
      }
    }
    if (question.answerCount < 10) {
      return {
        type: 'low',
        icon: TrendingDown,
        color: 'text-red-400 bg-red-500/10 border-red-500/20',
        label: '答卷数偏低',
        message: '考虑推广以获得更多反馈'
      }
    }
    return {
      type: 'default',
      icon: Eye,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      label: '需要关注',
      message: ''
    }
  }

  return (
    <div className="p-5 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-400" />
          需要关注
        </h2>
        {needAttention.length > 0 && (
          <span className="px-2 py-1 text-xs font-medium text-orange-400 bg-orange-500/10 rounded border border-orange-500/20">
            {needAttention.length} 个
          </span>
        )}
      </div>

      <div className="space-y-3">
        {needAttention.map((question: any) => {
          const { _id, title, answerCount = 0, isPublish } = question
          const alert = getAlertType(question)
          const AlertIcon = alert.icon

          return (
            <Link
              key={_id}
              to={isPublish ? `/question/static/${_id}` : `/question/edit/${_id}`}
              className="block group"
            >
              <div className="p-4 rounded-lg border border-slate-700/50 hover:border-orange-500/50 bg-slate-800/30 hover:bg-slate-800/50 transition-all">
                <div className="flex items-start gap-3">
                  {/* 警告图标 */}
                  <div className={`flex-shrink-0 p-2 rounded-lg ${alert.color}`}>
                    <AlertIcon className="w-4 h-4" />
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 mb-1 truncate group-hover:text-orange-400 transition-colors">
                      {title}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${alert.color.replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                        {alert.label}
                      </span>
                      {isPublish && (
                        <span className="text-xs text-slate-500">
                          {answerCount} 答卷
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {needAttention.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">暂无需要关注的问卷</p>
          <p className="text-xs mt-1">所有星标问卷状态良好 ✨</p>
        </div>
      )}
    </div>
  )
}

export default AttentionNeeded

