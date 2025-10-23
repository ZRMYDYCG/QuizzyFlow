import { FC, useMemo } from 'react'
import { useManageTheme } from '@/hooks/useManageTheme'
import { 
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TrendingUp } from 'lucide-react'

interface TrendChartProps {
  questions: any[]
}

const TrendChart: FC<TrendChartProps> = ({ questions }) => {
  const t = useManageTheme()

  // 准备图表数据 - 最近7天的问卷创建和答卷趋势
  const chartData = useMemo(() => {
    const data = []
    const now = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      // 统计该天创建的问卷数
      const created = questions.filter((q: any) => {
        const qDate = new Date(q.createdAt)
        return qDate >= date && qDate < nextDate
      }).length

      // 统计该天的答卷数（模拟数据，实际需要从答卷表获取）
      const answers = questions.filter((q: any) => {
        const qDate = new Date(q.createdAt)
        return qDate >= date && qDate < nextDate
      }).reduce((sum: number, q: any) => sum + (q.answerCount || 0), 0)

      data.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        created,
        answers,
      })
    }

    return data
  }, [questions])

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null

    return (
      <div className={`p-3 rounded-lg border shadow-lg ${
        t.isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-gray-200'
      }`}>
        <p className={`text-sm font-medium mb-2 ${t.text.primary}`}>
          {payload[0].payload.date}
        </p>
        {payload.map((item: any, index: number) => (
          <p key={index} className={`text-xs ${t.text.secondary}`}>
            <span style={{ color: item.color }}>●</span> {item.name}: {item.value}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className={`p-5 rounded-xl border ${
      t.isDark 
        ? 'bg-gradient-to-br from-slate-800/80 to-slate-800/40 border-slate-700/50' 
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className={`text-base md:text-lg font-semibold ${t.text.primary}`}>
            7天趋势
          </h3>
        </div>
        <div className={`text-xs ${t.text.tertiary}`}>
          问卷创建 & 答卷收集
        </div>
      </div>

      {/* 图表 */}
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAnswers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={t.isDark ? '#334155' : '#e5e7eb'}
              opacity={0.5}
            />
            <XAxis 
              dataKey="date" 
              stroke={t.isDark ? '#64748b' : '#9ca3af'}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke={t.isDark ? '#64748b' : '#9ca3af'}
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                fontSize: '12px',
                color: t.isDark ? '#94a3b8' : '#6b7280'
              }}
            />
            <Area
              type="monotone"
              dataKey="created"
              name="创建问卷"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorCreated)"
            />
            <Area
              type="monotone"
              dataKey="answers"
              name="收集答卷"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorAnswers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TrendChart

