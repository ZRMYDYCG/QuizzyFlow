import React from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ICheckboxStatisticsProps } from './interface.ts'

const StatComponent: React.FC<ICheckboxStatisticsProps> = ({ stat }) => {
  return (
    <div className="w-[400px] h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={400}
          height={300}
          data={stat}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8"></Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StatComponent
