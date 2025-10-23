import { FC, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useManageTheme } from '@/hooks/useManageTheme'
import { 
  Activity, 
  FileText, 
  CheckCircle2,
  Star,
  Edit,
  Clock,
} from 'lucide-react'

interface RecentActivityProps {
  questions: any[]
}

const RecentActivity: FC<RecentActivityProps> = ({ questions }) => {
  const navigate = useNavigate()
  const t = useManageTheme()

  // 获取最近的活动（按创建时间排序）
  const recentActivities = useMemo(() => {
    const activities: any[] = []

    // 将问卷转换为活动项
    questions
      .sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10)
      .forEach((q: any) => {
        activities.push({
          id: q._id,
          type: q.isPublished ? 'published' : 'created',
          title: q.title,
          time: q.createdAt,
          isStarred: q.isStar,
        })
      })

    return activities
  }, [questions])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'published':
        return CheckCircle2
      case 'created':
        return FileText
      case 'edited':
        return Edit
      default:
        return Activity
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'published':
        return 'text-emerald-400 bg-emerald-500/10'
      case 'created':
        return 'text-blue-400 bg-blue-500/10'
      case 'edited':
        return 'text-purple-400 bg-purple-500/10'
      default:
        return 'text-gray-400 bg-gray-500/10'
    }
  }

  const getActivityText = (type: string) => {
    switch (type) {
      case 'published':
        return '发布了问卷'
      case 'created':
        return '创建了问卷'
      case 'edited':
        return '编辑了问卷'
      default:
        return '活动'
    }
  }

  const formatTime = (time: string) => {
    const now = new Date()
    const activityTime = new Date(time)
    const diff = now.getTime() - activityTime.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return activityTime.toLocaleDateString()
  }

  return (
    <div className={`p-5 rounded-xl border ${
      t.isDark 
        ? 'bg-gradient-to-br from-slate-800/80 to-slate-800/40 border-slate-700/50' 
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-cyan-400" />
        <h3 className={`text-base md:text-lg font-semibold ${t.text.primary}`}>
          最近活动
        </h3>
      </div>

      {/* 活动列表 */}
      <div className="space-y-3">
        {recentActivities.length > 0 ? (
          recentActivities.map((activity: any) => {
            const Icon = getActivityIcon(activity.type)
            const colorClass = getActivityColor(activity.type)

            return (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all hover:scale-[1.01] cursor-pointer ${
                  t.isDark
                    ? 'hover:bg-slate-800/50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => navigate(`/question/edit/${activity.id}`)}
              >
                {/* 图标 */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* 活动内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className={`text-sm ${t.text.primary}`}>
                      {getActivityText(activity.type)}
                    </div>
                    {activity.isStarred && (
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className={`text-sm font-medium truncate mb-1 ${t.text.secondary}`}>
                    「{activity.title}」
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${t.text.tertiary}`}>
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(activity.time)}</span>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className={`flex flex-col items-center justify-center py-8 ${t.text.tertiary}`}>
            <Activity className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm">暂无活动记录</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentActivity

