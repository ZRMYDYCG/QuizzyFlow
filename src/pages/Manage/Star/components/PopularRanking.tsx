import { FC } from 'react'
import { TrendingUp, BarChart3, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useManageTheme } from '@/hooks/useManageTheme'

interface PopularRankingProps {
  questions: any[]
}

const PopularRanking: FC<PopularRankingProps> = ({ questions }) => {
  const t = useManageTheme()
  
  // 按答卷数排序，取前5名
  const topQuestions = [...questions]
    .sort((a, b) => (b.answerCount || 0) - (a.answerCount || 0))
    .slice(0, 5)

  if (topQuestions.length === 0) return null

  const maxCount = Math.max(...topQuestions.map(q => q.answerCount || 0))

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50'
      case 1: return 'text-slate-300 bg-slate-500/20 border-slate-500/50'
      case 2: return 'text-orange-400 bg-orange-500/20 border-orange-500/50'
      default: return 'text-slate-500 bg-slate-700/20 border-slate-600/50'
    }
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return `${index + 1}`
    }
  }

  return (
    <div className={`p-5 rounded-xl border ${
      t.isDark 
        ? 'bg-gradient-to-br from-slate-800/80 to-slate-800/40 border-slate-700/50 backdrop-blur-sm' 
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${t.text.primary}`}>
          <TrendingUp className="w-5 h-5 text-blue-400" />
          热门收藏
        </h2>
        <span className={`text-xs ${t.text.tertiary}`}>按答卷数排序</span>
      </div>

      <div className="space-y-3">
        {topQuestions.map((question: any, index: number) => {
          const { _id, title, answerCount = 0, isPublished } = question
          const percentage = maxCount > 0 ? (answerCount / maxCount) * 100 : 0

          return (
            <Link
              key={_id}
              to={isPublished ? `/question/static/${_id}` : `/question/edit/${_id}`}
              className="group block"
            >
              <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                t.isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'
              }`}>
                {/* 排名 */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border ${getRankColor(index)}`}>
                  {getRankIcon(index)}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-sm font-medium truncate group-hover:text-blue-400 transition-colors ${t.text.primary}`}>
                      {title}
                    </p>
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                  </div>
                  
                  {/* 进度条 */}
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${
                      t.isDark ? 'bg-slate-700/50' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${t.text.secondary}`}>
                      <BarChart3 className="w-3 h-3" />
                      <span className="font-semibold text-blue-400">{answerCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {topQuestions.length === 0 && (
        <div className={`text-center py-8 ${t.text.secondary}`}>
          <p className="text-sm">暂无数据</p>
        </div>
      )}
    </div>
  )
}

export default PopularRanking

