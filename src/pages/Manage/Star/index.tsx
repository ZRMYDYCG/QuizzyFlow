import { useTitle } from 'ahooks'
import { useState, useMemo } from 'react'
import useLoadQuestionListData from '@/hooks/useLoadQuestionListData'
import useGetUserInfo from '@/hooks/useGetUserInfo'
import { Loader2, Star as StarIcon, TrendingUp, FileText, AlertCircle, Sparkles } from 'lucide-react'
import { useManageTheme } from '@/hooks/useManageTheme'

// 组件导入
import StatCard from './components/StatCard'
import RecentStarred from './components/RecentStarred'
import PopularRanking from './components/PopularRanking'
import AttentionNeeded from './components/AttentionNeeded'
import StarViewSwitcher, { StarViewMode } from './components/StarViewSwitcher'

// 复用其他视图组件
import QuestionsCard from '../List/components/QuestionsCard'
import QuestionListView from '../List/components/QuestionListView'
import QuestionTableView from '../List/components/QuestionTableView'

const Star = () => {
  useTitle('星标问卷')
  const { username, nickname } = useGetUserInfo()
  const t = useManageTheme()

  const { data = {}, loading } = useLoadQuestionListData({ isStar: true })
  const { list = [], total = 0 } = data

  // 视图模式状态
  const [viewMode, setViewMode] = useState<StarViewMode>(() => {
    const saved = localStorage.getItem('starViewMode')
    return (saved as StarViewMode) || 'dashboard'
  })

  const handleViewChange = (mode: StarViewMode) => {
    setViewMode(mode)
    localStorage.setItem('starViewMode', mode)
  }

  // 计算统计数据
  const stats = useMemo(() => {
    const published = list.filter((q: any) => q.isPublished).length
    const active = list.filter((q: any) => q.isPublished && q.answerCount > 10).length
    const needAttention = list.filter((q: any) => !q.isPublished || q.answerCount < 10).length
    
    return {
      total,
      published,
      active,
      needAttention,
    }
  }, [list, total])

  // 问候语
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  return (
    <div className="min-h-full">
      {/* 顶部标题区域 */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2 ${t.text.primary}`}>
              {greeting}, {nickname || username}!
            </h1>
            <p className={`text-sm flex items-center gap-2 ${t.text.secondary}`}>
              <Sparkles className="w-4 h-4" />
              您的星标收藏 · 共 {total} 个问卷
            </p>
          </div>
          
          {/* 视图切换器 */}
          {list.length > 0 && (
            <StarViewSwitcher currentView={viewMode} onViewChange={handleViewChange} />
          )}
        </div>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className={`flex items-center justify-center gap-2 py-20 ${t.text.secondary}`}>
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>加载中...</span>
        </div>
      )}

      {/* 空状态 */}
      {!loading && list.length === 0 && (
        <div className={`flex flex-col items-center justify-center py-20 ${t.text.secondary}`}>
          <StarIcon className={`w-20 h-20 mb-4 ${t.text.tertiary}`} />
          <p className="text-lg font-medium">暂无星标问卷</p>
          <p className={`text-sm mt-1 ${t.text.tertiary}`}>为重要问卷添加星标以便快速访问</p>
        </div>
      )}

      {/* 内容区域 */}
      {!loading && list.length > 0 && (
        <>
          {/* 仪表盘视图 */}
          {viewMode === 'dashboard' && (
            <div className="space-y-6">
              {/* 数据统计卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <StatCard
                  title="总星标"
                  value={stats.total}
                  icon={StarIcon}
                  color="text-yellow-400"
                  subtitle="全部收藏"
                />
                <StatCard
                  title="已发布"
                  value={stats.published}
                  icon={FileText}
                  color="text-blue-400"
                  subtitle="正在运行"
                />
                <StatCard
                  title="活跃问卷"
                  value={stats.active}
                  icon={TrendingUp}
                  color="text-emerald-400"
                  subtitle="答卷 > 10"
                />
                <StatCard
                  title="需关注"
                  value={stats.needAttention}
                  icon={AlertCircle}
                  color="text-orange-400"
                  subtitle="待处理"
                />
              </div>

              {/* 最近标星 */}
              <RecentStarred questions={list} />

              {/* 热门收藏 + 需要关注 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <PopularRanking questions={list} />
                <AttentionNeeded questions={list} />
              </div>
            </div>
          )}

          {/* 网格视图 */}
          {viewMode === 'grid' && (
            <div className="space-y-3 md:space-y-4">
              {list.map((question: any) => (
                <QuestionsCard key={question._id} {...question} />
              ))}
            </div>
          )}

          {/* 列表视图 */}
          {viewMode === 'list' && (
            <QuestionListView questions={list} />
          )}

          {/* 时间线视图（使用表格视图代替） */}
          {viewMode === 'timeline' && (
            <QuestionTableView questions={list} />
          )}
        </>
      )}
    </div>
  )
}

export default Star
