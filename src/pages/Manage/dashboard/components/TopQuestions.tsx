import { FC, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useManageTheme } from '@/hooks/useManageTheme'
import { Trophy, Users, TrendingUp, ExternalLink } from 'lucide-react'

interface TopQuestionsProps {
  questions: any[]
}

const TopQuestions: FC<TopQuestionsProps> = ({ questions }) => {
  const navigate = useNavigate()
  const t = useManageTheme()

  // 获取答卷数最多的前5个问卷
  const topQuestions = useMemo(() => {
    return questions
      .filter((q: any) => q.isPublished && (q.answerCount || 0) > 0)
      .sort((a: any, b: any) => (b.answerCount || 0) - (a.answerCount || 0))
      .slice(0, 5)
  }, [questions])

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 1: return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
      case 2: return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    }
  }

  return (
    <div className={`p-5 rounded-xl border ${
      t.isDark 
        ? 'bg-gradient-to-br from-slate-800/80 to-slate-800/40 border-slate-700/50' 
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h3 className={`text-base md:text-lg font-semibold ${t.text.primary}`}>
          热门问卷排行
        </h3>
      </div>

      {/* 列表 */}
      <div className="space-y-3">
        {topQuestions.length > 0 ? (
          topQuestions.map((question: any, index: number) => (
            <div
              key={question._id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer ${
                t.isDark
                  ? 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => navigate(`/question/statistics/${question._id}`)}
            >
              {/* 排名徽章 */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-sm ${getRankColor(index)}`}>
                {index + 1}
              </div>

              {/* 问卷信息 */}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate mb-1 ${t.text.primary}`}>
                  {question.title}
                </div>
                <div className={`flex items-center gap-2 text-xs ${t.text.tertiary}`}>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{question.answerCount || 0} 答卷</span>
                  </div>
                  <span>•</span>
                  <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex-shrink-0">
                <ExternalLink className={`w-4 h-4 ${t.text.tertiary}`} />
              </div>
            </div>
          ))
        ) : (
          <div className={`flex flex-col items-center justify-center py-8 ${t.text.tertiary}`}>
            <TrendingUp className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm">暂无热门问卷</p>
            <p className="text-xs mt-1">发布问卷并收集答卷后将显示在这里</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopQuestions

