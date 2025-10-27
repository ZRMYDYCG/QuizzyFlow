import { useTitle, useRequest } from 'ahooks'
import { useMemo } from 'react'
import useLoadQuestionListData from '@/hooks/useLoadQuestionListData'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { getQuestionStatistics } from '@/api/modules/question'
import { useManageTheme } from '@/hooks/useManageTheme'
import { 
  Loader2,
  Sparkles,
  FileText,
  CheckCircle2,
  Star,
  Users,
  TrendingUp,
  Activity,
  Clock,
  Trash2,
} from 'lucide-react'

// 组件导入
import StatCard from './components/StatCard'
import QuickActions from './components/QuickActions'
import RecentActivity from './components/RecentActivity'
import TrendChart from './components/TrendChart'
import CategoryDistribution from './components/CategoryDistribution'
import TopQuestions from './components/TopQuestions'

const Dashboard = () => {
  useTitle('仪表盘 - QuizzyFlow')
  const { username, nickname } = useGetUserInfo()
  const t = useManageTheme()

  // 获取所有问卷数据
  const { data: allData = {}, loading: allLoading } = useLoadQuestionListData({})
  const { list: allList = [] } = allData

  // 获取统计信息
  const { data: stats, loading: statsLoading } = useRequest(
    async () => {
      return await getQuestionStatistics()
    },
    {
      refreshDeps: [],
    }
  )

  // 计算更详细的统计
  const detailedStats = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const lastWeek = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)

    // 今天创建的问卷
    const todayQuestions = allList.filter((q: any) => 
      new Date(q.createdAt) >= today
    ).length

    // 本周创建的问卷
    const thisWeekQuestions = allList.filter((q: any) => 
      new Date(q.createdAt) >= thisWeek
    ).length

    // 上周创建的问卷（用于计算增长率）
    const lastWeekQuestions = allList.filter((q: any) => {
      const created = new Date(q.createdAt)
      return created >= lastWeek && created < thisWeek
    }).length

    // 总答卷数
    const totalAnswers = allList.reduce((sum: number, q: any) => 
      sum + (q.answerCount || 0), 0
    )

    // 活跃问卷（有答卷的已发布问卷）
    const activeQuestions = allList.filter((q: any) => 
      q.isPublished && (q.answerCount || 0) > 0
    ).length

    // 计算增长率
    const growthRate = lastWeekQuestions > 0 
      ? Math.round(((thisWeekQuestions - lastWeekQuestions) / lastWeekQuestions) * 100)
      : thisWeekQuestions > 0 ? 100 : 0

    return {
      total: stats?.total || 0,
      published: stats?.published || 0,
      starred: stats?.starred || 0,
      deleted: stats?.deleted || 0,
      normal: stats?.normal || 0,
      todayQuestions,
      thisWeekQuestions,
      totalAnswers,
      activeQuestions,
      growthRate,
    }
  }, [allList, stats])

  // 问候语
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const loading = allLoading || statsLoading

  return (
    <div className="min-h-full">
      {/* 加载状态 */}
      {loading && (
        <div className={`flex items-center justify-center gap-2 py-20 ${t.text.secondary}`}>
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>加载中...</span>
        </div>
      )}

      {/* 主内容 */}
      {!loading && (
        <div className="space-y-6">
          {/* 核心统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard
              title="总问卷数"
              value={detailedStats.total}
              icon={FileText}
              color="blue"
              trend={detailedStats.todayQuestions > 0 ? 'up' : undefined}
              subtitle={`今日新增 ${detailedStats.todayQuestions} 个`}
            />
            <StatCard
              title="已发布"
              value={detailedStats.published}
              icon={CheckCircle2}
              color="green"
              percentage={detailedStats.total > 0 
                ? Math.round((detailedStats.published / detailedStats.total) * 100)
                : 0
              }
              subtitle={`发布率 ${detailedStats.total > 0 
                ? Math.round((detailedStats.published / detailedStats.total) * 100)
                : 0}%`}
            />
            <StatCard
              title="星标收藏"
              value={detailedStats.starred}
              icon={Star}
              color="yellow"
              subtitle="重要问卷"
            />
            <StatCard
              title="总答卷数"
              value={detailedStats.totalAnswers}
              icon={Users}
              color="purple"
              trend={detailedStats.totalAnswers > 0 ? 'up' : undefined}
              subtitle={`活跃问卷 ${detailedStats.activeQuestions} 个`}
            />
          </div>

          {/* 次要统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard
              title="本周新增"
              value={detailedStats.thisWeekQuestions}
              icon={TrendingUp}
              color="emerald"
              trend={detailedStats.growthRate > 0 ? 'up' : detailedStats.growthRate < 0 ? 'down' : undefined}
              subtitle={
                detailedStats.growthRate > 0 
                  ? `增长 ${detailedStats.growthRate}%`
                  : detailedStats.growthRate < 0
                  ? `下降 ${Math.abs(detailedStats.growthRate)}%`
                  : '保持稳定'
              }
            />
            <StatCard
              title="活跃问卷"
              value={detailedStats.activeQuestions}
              icon={Activity}
              color="cyan"
              percentage={detailedStats.published > 0
                ? Math.round((detailedStats.activeQuestions / detailedStats.published) * 100)
                : 0
              }
              subtitle={`活跃率 ${detailedStats.published > 0
                ? Math.round((detailedStats.activeQuestions / detailedStats.published) * 100)
                : 0}%`}
            />
            <StatCard
              title="待处理"
              value={detailedStats.total - detailedStats.published}
              icon={Clock}
              color="orange"
              subtitle="未发布问卷"
            />
            <StatCard
              title="回收站"
              value={detailedStats.deleted}
              icon={Trash2}
              color="red"
              subtitle="已删除问卷"
            />
          </div>

          {/* 图表和快速操作 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* 趋势图 - 占2列 */}
            <div className="lg:col-span-2">
              <TrendChart questions={allList} />
            </div>

            {/* 快速操作 */}
            <QuickActions />
          </div>

          {/* 分布和排行 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* 问卷分类分布 */}
            <CategoryDistribution 
              published={detailedStats.published}
              draft={detailedStats.total - detailedStats.published}
              starred={detailedStats.starred}
              deleted={detailedStats.deleted}
            />

            {/* 热门问卷排行 */}
            <TopQuestions questions={allList} />
          </div>

          {/* 最近活动 */}
          <RecentActivity questions={allList} />
        </div>
      )}
    </div>
  )
}

export default Dashboard

