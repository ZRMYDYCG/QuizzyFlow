import { memo, useMemo } from 'react'
import { useRequest } from 'ahooks'
import { useParams } from 'react-router-dom'
import { Spin, Empty } from 'antd'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { getAnswerStatistics } from '@/api/modules/statistics'
import { useManageTheme } from '@/hooks/useManageTheme'
import { CHART_STAT_TYPES } from '../constants'
import { cn } from '@/utils'

interface ComponentStatPanelProps {
  componentId: string
  componentType: string
  componentTitle: string
}

const BAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']

const ComponentStatPanel = memo(
  ({ componentId, componentType, componentTitle }: ComponentStatPanelProps) => {
    const { id = '' } = useParams()
    const t = useManageTheme()

    const chartable = CHART_STAT_TYPES.has(componentType)

    const { data, loading } = useRequest(
      async () => {
        if (!chartable || !componentId) return null
        return await getAnswerStatistics(id, componentId)
      },
      { refreshDeps: [id, componentId, componentType] }
    )

    const chartData = useMemo(() => {
      const stat = data?.stat as { name: string; count: number }[] | undefined
      if (!stat?.length) return []
      return stat.filter((item) => item.count > 0)
    }, [data])

    if (!chartable || !componentId) return null

    return (
      <div
        className={cn(
          'rounded-lg border p-3 md:p-4 mb-3 md:mb-4 flex-shrink-0',
          t.isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-gray-50 border-gray-100'
        )}
      >
        <h4 className={cn('text-sm font-semibold mb-3', t.text.primary)}>
          「{componentTitle}」选项分布
        </h4>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : chartData.length === 0 ? (
          <Empty description="暂无有效作答" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={t.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: t.isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={56}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: t.isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: t.isDark ? '#1e293b' : '#fff',
                  border: `1px solid ${t.isDark ? '#334155' : '#e5e7eb'}`,
                  borderRadius: 8,
                }}
                formatter={(value: number) => [`${value} 人`, '作答数']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    )
  }
)

ComponentStatPanel.displayName = 'ComponentStatPanel'

export default ComponentStatPanel
