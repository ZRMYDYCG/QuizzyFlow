import { FC, useMemo } from 'react'
import { useManageTheme } from '@/hooks/useManageTheme'
import { 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'

interface CategoryDistributionProps {
  published: number
  draft: number
  starred: number
  deleted: number
}

const CategoryDistribution: FC<CategoryDistributionProps> = ({
  published,
  draft,
  starred,
  deleted,
}) => {
  const t = useManageTheme()

  const data = useMemo(() => [
    { name: '已发布', value: published, color: '#10b981' },
    { name: '草稿', value: draft, color: '#f59e0b' },
    { name: '星标', value: starred, color: '#eab308' },
    { name: '已删除', value: deleted, color: '#ef4444' },
  ].filter(item => item.value > 0), [published, draft, starred, deleted])

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null

    const total = data.reduce((sum, item) => sum + item.value, 0)
    const percentage = ((payload[0].value / total) * 100).toFixed(1)

    return (
      <div className={`p-3 rounded-lg border shadow-lg ${
        t.isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-gray-200'
      }`}>
        <p className={`text-sm font-medium mb-1 ${t.text.primary}`}>
          {payload[0].name}
        </p>
        <p className={`text-xs ${t.text.secondary}`}>
          数量: {payload[0].value}
        </p>
        <p className={`text-xs ${t.text.secondary}`}>
          占比: {percentage}%
        </p>
      </div>
    )
  }

  // 自定义图例
  const renderLegend = (props: any) => {
    const { payload } = props
    const total = data.reduce((sum, item) => sum + item.value, 0)

    return (
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {payload.map((entry: any, index: number) => {
          const percentage = ((entry.payload.value / total) * 100).toFixed(1)
          return (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className={`text-xs ${t.text.secondary}`}>
                {entry.value} ({percentage}%)
              </span>
            </div>
          )
        })}
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
      <div className="flex items-center gap-2 mb-4">
        <PieChartIcon className="w-5 h-5 text-purple-400" />
        <h3 className={`text-base md:text-lg font-semibold ${t.text.primary}`}>
          问卷分布
        </h3>
      </div>

      {/* 图表 */}
      {data.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className={`flex items-center justify-center h-64 ${t.text.tertiary}`}>
          <p>暂无数据</p>
        </div>
      )}
    </div>
  )
}

export default CategoryDistribution

