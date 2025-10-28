/**
 * 管理后台 - 答卷统计分析
 */
import React from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Spin,
  Empty,
} from 'antd'
import {
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  RiseOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useRequest } from 'ahooks'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getAnswerStatistics, type AnswerStatistics } from '@/api/modules/admin-answer'

const AnswerStatisticsPage: React.FC = () => {
  // 加载统计数据
  const { data: statistics, loading } = useRequest(
    async () => {
      return await getAnswerStatistics()
    },
    {
      onError: () => {
        // message.error('加载统计数据失败')
      },
    }
  )

  // Top 10 问卷表格列
  const questionColumns: ColumnsType<any> = [
    {
      title: '排名',
      key: 'rank',
      width: 80,
      render: (_, __, index) => (
        <span className="font-semibold text-lg">{index + 1}</span>
      ),
    },
    {
      title: '问卷标题',
      dataIndex: 'questionTitle',
      key: 'questionTitle',
      ellipsis: true,
    },
    {
      title: '答卷数',
      dataIndex: 'count',
      key: 'count',
      width: 120,
      sorter: (a, b) => a.count - b.count,
      render: (count) => (
        <Tag color="blue" className="text-base font-semibold">
          {count}
        </Tag>
      ),
    },
  ]

  // 趋势图数据
  const trendData = statistics?.trendLast7Days || []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="加载统计数据中..." />
      </div>
    )
  }

  if (!statistics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Empty description="暂无统计数据" />
      </div>
    )
  }

  // 计算完成率（正常答卷占比）
  const completionRate = statistics.total > 0
    ? ((statistics.validCount / statistics.total) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold mb-2">统计分析</h1>
        <p className="text-gray-600">
          全面的答卷数据统计与分析，洞察问卷填写情况
        </p>
      </div>

      {/* 数据说明 */}
      <Card title="数据说明">
        <div className="space-y-2 text-sm text-gray-600">
          <div>• <span className="font-semibold">总答卷数：</span>系统中所有答卷的总数</div>
          <div>• <span className="font-semibold">今日新增：</span>今天提交的答卷数量</div>
          <div>• <span className="font-semibold">正常答卷：</span>标记为有效的答卷数量</div>
          <div>• <span className="font-semibold">异常答卷：</span>标记为无效的答卷数量（测试数据、垃圾数据等）</div>
          <div>• <span className="font-semibold">平均答题时长：</span>所有答卷的平均用时</div>
          <div>• <span className="font-semibold">完成率：</span>正常答卷占总答卷的百分比</div>
        </div>
      </Card>

      {/* 总览统计卡片 */}
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总答卷数"
              value={statistics.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日新增"
              value={statistics.todayCount}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={`/ ${statistics.last7DaysCount} (7天)`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="正常答卷"
              value={statistics.validCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${statistics.total}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="异常答卷"
              value={statistics.invalidCount}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
              suffix={`/ ${statistics.total}`}
            />
          </Card>
        </Col>
      </Row>

      {/* 第二行统计 */}
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="平均答题时长"
              value={Math.round(statistics.avgDuration)}
              prefix={<ClockCircleOutlined />}
              suffix="秒"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="完成率"
              value={completionRate}
              suffix="%"
              valueStyle={{ color: '#13c2c2' }}
            />
            <div className="text-xs text-gray-500 mt-2">
              正常答卷占比
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="最近30天"
              value={statistics.last30DaysCount}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 趋势图 */}
      <Card title="最近7天提交趋势" loading={loading}>
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#1890ff" 
                strokeWidth={2}
                name="答卷数"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Empty description="暂无趋势数据" />
        )}
      </Card>

      {/* Top 10 问卷 */}
      <Card title="答卷数 Top 10 问卷" loading={loading}>
        {statistics.byQuestion.length > 0 ? (
          <Table
            columns={questionColumns}
            dataSource={statistics.byQuestion}
            rowKey="questionId"
            pagination={false}
            size="middle"
          />
        ) : (
          <Empty description="暂无问卷数据" />
        )}
      </Card>
    </div>
  )
}

export default AnswerStatisticsPage

