import React from 'react'
import { Card, Spin, Typography, Row, Col, Statistic, Empty } from 'antd'
import {
  FileTextOutlined,
  CheckCircleOutlined,
  StarOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { getUserStatistics } from '@/api/modules/user'
import ActivityHeatmap from './components/ActivityHeatmap'
import { useRequest } from 'ahooks'

const { Title, Text } = Typography

const COLORS = [
  '#1890ff',
  '#52c41a',
  '#faad14',
  '#f5222d',
  '#722ed1',
  '#13c2c2',
  '#eb2f96',
  '#fa8c16',
  '#a0d911',
  '#2f54eb',
]

const ProfileStatistics: React.FC = () => {
  const { data: statistics, loading } = useRequest(
    async () => {
      return await getUserStatistics()
    },
    {
      manual: false,
    }
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" tip="加载统计数据..." />
      </div>
    )
  }

  if (!statistics) {
    return (
      <Card>
        <Empty description="暂无统计数据" />
      </Card>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 标题 */}
      <Title level={3} className="text-lg md:text-2xl">
        <BarChartOutlined className="mr-2" />
        数据统计
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md">
            <Statistic
              title="总问卷数"
              value={statistics.questionStats.total}
              prefix={<FileTextOutlined className="text-blue-500" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md">
            <Statistic
              title="已发布"
              value={statistics.questionStats.published}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md">
            <Statistic
              title="已收藏"
              value={statistics.questionStats.starred}
              prefix={<StarOutlined className="text-yellow-500" />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md">
            <Statistic
              title="总回答数"
              value={statistics.questionStats.totalAnswers}
              prefix={<BarChartOutlined className="text-purple-500" />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 创建趋势图 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="最近7天创建趋势" className="shadow-md">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={statistics.last7DaysTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                  tick={{ fontSize: 11 }}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString()
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="创建数量"
                  stroke="#1890ff"
                  strokeWidth={2}
                  dot={{ fill: '#1890ff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="最近30天创建趋势" className="shadow-md">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={statistics.last30DaysTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                  tick={{ fontSize: 11 }}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString()
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="创建数量"
                  stroke="#52c41a"
                  strokeWidth={2}
                  dot={{ fill: '#52c41a' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 组件使用统计 */}
      <Card title="组件使用统计（Top 10）" className="shadow-md">
        {statistics.componentTypeStats.length > 0 ? (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistics.componentTypeStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="type"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 11 }}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="count" name="使用次数" fill="#1890ff">
                    {statistics.componentTypeStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Col>
            <Col xs={24} lg={8}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statistics.componentTypeStats}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={(entry) => entry.type}
                  >
                    {statistics.componentTypeStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        ) : (
          <Empty description="暂无组件使用数据" />
        )}
      </Card>

      {/* 活跃度热力图 */}
      <Card title="活跃度热力图（最近一年）" className="shadow-md">
        <Text type="secondary" className="block mb-4 text-xs md:text-sm">
          颜色越深表示该天的活跃度越高（创建和编辑问卷的次数）
        </Text>
        <div className="overflow-x-auto">
          <ActivityHeatmap data={statistics.activityHeatmap} />
        </div>
      </Card>
    </div>
  )
}

export default ProfileStatistics

