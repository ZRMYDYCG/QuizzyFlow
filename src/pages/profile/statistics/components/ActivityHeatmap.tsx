import React, { useMemo } from 'react'
import { Tooltip } from 'antd'
import { clsx } from 'clsx'

interface ActivityData {
  date: string
  count: number
}

interface ActivityHeatmapProps {
  data: ActivityData[]
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
  // 生成最近一年的所有日期
  const heatmapData = useMemo(() => {
    const today = new Date()
    const oneYearAgo = new Date(today)
    oneYearAgo.setFullYear(today.getFullYear() - 1)
    
    const dateMap = new Map(data.map(item => [item.date, item.count]))
    const result: Array<{ date: string; count: number; dateObj: Date }> = []
    
    const currentDate = new Date(oneYearAgo)
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0]
      result.push({
        date: dateStr,
        count: dateMap.get(dateStr) || 0,
        dateObj: new Date(currentDate),
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return result
  }, [data])

  // 按周分组
  const weekGroups = useMemo(() => {
    const weeks: Array<Array<{ date: string; count: number; dateObj: Date; dayOfWeek: number }>> = []
    let currentWeek: Array<{ date: string; count: number; dateObj: Date; dayOfWeek: number }> = []
    
    heatmapData.forEach((item, index) => {
      const dayOfWeek = item.dateObj.getDay()
      
      // 如果是第一个元素，需要填充前面的空白
      if (index === 0 && dayOfWeek !== 0) {
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push({
            date: '',
            count: -1,
            dateObj: new Date(),
            dayOfWeek: i,
          })
        }
      }
      
      currentWeek.push({ ...item, dayOfWeek })
      
      // 如果是周六或者是最后一个元素，开始新的一周
      if (dayOfWeek === 6 || index === heatmapData.length - 1) {
        // 填充剩余的空白
        while (currentWeek.length < 7) {
          currentWeek.push({
            date: '',
            count: -1,
            dateObj: new Date(),
            dayOfWeek: currentWeek.length,
          })
        }
        weeks.push(currentWeek)
        currentWeek = []
      }
    })
    
    return weeks
  }, [heatmapData])

  // 获取颜色强度
  const getColor = (count: number) => {
    if (count === -1) return 'bg-transparent'
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
    if (count === 1) return 'bg-green-200 dark:bg-green-900'
    if (count === 2) return 'bg-green-300 dark:bg-green-800'
    if (count <= 4) return 'bg-green-400 dark:bg-green-700'
    if (count <= 6) return 'bg-green-500 dark:bg-green-600'
    return 'bg-green-600 dark:bg-green-500'
  }

  const weekDayLabels = ['日', '一', '二', '三', '四', '五', '六']
  
  // 获取月份标签
  const monthLabels = useMemo(() => {
    const labels: Array<{ month: string; weekIndex: number }> = []
    let lastMonth = -1
    
    weekGroups.forEach((week, weekIndex) => {
      const firstValidDay = week.find(day => day.count !== -1)
      if (firstValidDay) {
        const month = firstValidDay.dateObj.getMonth()
        if (month !== lastMonth) {
          labels.push({
            month: `${month + 1}月`,
            weekIndex,
          })
          lastMonth = month
        }
      }
    })
    
    return labels
  }, [weekGroups])

  return (
    <div className="overflow-x-auto pb-4">
      <div className="inline-block min-w-full">
        {/* 月份标签 */}
        <div className="flex gap-0.5 mb-2 ml-8">
          {monthLabels.map((label, index) => (
            <div
              key={index}
              className="text-xs text-gray-500 dark:text-gray-400"
              style={{ marginLeft: index === 0 ? 0 : `${(label.weekIndex - (monthLabels[index - 1]?.weekIndex || 0) - 1) * 14}px` }}
            >
              {label.month}
            </div>
          ))}
        </div>
        
        <div className="flex gap-0.5">
          {/* 星期标签 */}
          <div className="flex flex-col gap-0.5 pr-2">
            {weekDayLabels.map((label, index) => (
              <div
                key={index}
                className={clsx(
                  'w-6 h-3 flex items-center justify-center',
                  'text-xs text-gray-500 dark:text-gray-400'
                )}
              >
                {index % 2 === 1 ? label : ''}
              </div>
            ))}
          </div>
          
          {/* 热力图网格 */}
          <div className="flex gap-0.5">
            {weekGroups.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {week.map((day, dayIndex) => {
                  if (day.count === -1) {
                    return (
                      <div
                        key={dayIndex}
                        className="w-3 h-3 bg-transparent"
                      />
                    )
                  }
                  
                  return (
                    <Tooltip
                      key={dayIndex}
                      title={
                        <div>
                          <div>{day.date}</div>
                          <div>{day.count} 次活动</div>
                        </div>
                      }
                    >
                      <div
                        className={clsx(
                          'w-3 h-3 rounded-sm cursor-pointer',
                          'border border-gray-200 dark:border-gray-700',
                          'hover:ring-2 hover:ring-blue-400',
                          'transition-all',
                          getColor(day.count)
                        )}
                      />
                    </Tooltip>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        
        {/* 图例 */}
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
          <span>少</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700" />
            <div className="w-3 h-3 bg-green-200 dark:bg-green-900 rounded-sm border border-gray-200 dark:border-gray-700" />
            <div className="w-3 h-3 bg-green-300 dark:bg-green-800 rounded-sm border border-gray-200 dark:border-gray-700" />
            <div className="w-3 h-3 bg-green-400 dark:bg-green-700 rounded-sm border border-gray-200 dark:border-gray-700" />
            <div className="w-3 h-3 bg-green-500 dark:bg-green-600 rounded-sm border border-gray-200 dark:border-gray-700" />
            <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-sm border border-gray-200 dark:border-gray-700" />
          </div>
          <span>多</span>
        </div>
      </div>
    </div>
  )
}

export default ActivityHeatmap

