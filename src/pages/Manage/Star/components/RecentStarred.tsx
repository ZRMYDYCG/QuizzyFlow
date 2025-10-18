import { FC, useRef } from 'react'
import { ChevronLeft, ChevronRight, Star, BarChart3, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

interface RecentStarredProps {
  questions: any[]
}

const RecentStarredCard: FC<{ question: any }> = ({ question }) => {
  const { _id, title, answerCount, createdAt, isPublish } = question

  return (
    <Link
      to={isPublish ? `/question/static/${_id}` : `/question/edit/${_id}`}
      className="group relative flex-shrink-0 w-[280px] md:w-[320px]"
    >
      <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-slate-700/50 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 h-full">
        {/* 星标图标 */}
        <div className="absolute top-3 right-3">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        </div>

        {/* 标题 */}
        <h3 className="text-base font-semibold text-slate-100 mb-3 pr-8 line-clamp-2 group-hover:text-yellow-400 transition-colors">
          {title}
        </h3>

        {/* 状态标签 */}
        <div className="flex items-center gap-2 mb-3">
          {isPublish ? (
            <span className="px-2 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20">
              已发布
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium text-slate-400 bg-slate-700/30 rounded border border-slate-600/30">
              未发布
            </span>
          )}
        </div>

        {/* 统计信息 */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5" />
            {answerCount} 答卷
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {createdAt}
          </span>
        </div>

        {/* 悬停效果 */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  )
}

const RecentStarred: FC<RecentStarredProps> = ({ questions }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (questions.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          最近标星
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-all border border-slate-700/50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-all border border-slate-700/50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 横向滚动容器 */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {questions.slice(0, 6).map((question: any) => (
          <RecentStarredCard key={question._id} question={question} />
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default RecentStarred

