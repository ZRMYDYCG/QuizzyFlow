import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { IComponentsStatisticsProps } from './interface.ts'

const ComponentsStatistics: React.FC<IComponentsStatisticsProps> = (
  props: IComponentsStatisticsProps
) => {
  const { stat } = props

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  const sum = useMemo(() => {
    let sum = 0
    for (const item of stat) {
      sum += item.count
    }
    return sum
  }, [stat])

  return (
    <div className="w-[300px] h-[400px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={stat}
            dataKey="count"
            nameKey="name"
            fill="#8884d8"
            label={({ name, count }) => `${name}: ${count / sum}%`}
          >
            {stat.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ComponentsStatistics
