/**
 * 管理后台 - 反馈统计
 */
import React from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Empty } from 'antd'
import {
  BugOutlined,
  BulbOutlined,
  ToolOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LikeOutlined,
} from '@ant-design/icons'
import { useRequest } from 'ahooks'
import dayjs from 'dayjs'
import { getFeedbackStatistics, type FeedbackStatistics } from '@/api/modules/admin-feedback'

const FeedbackStatisticsPage: React.FC = () => {
  // 加载统计数据
  const { data, loading } = useRequest(
    async () => {
      const res = await getFeedbackStatistics()
      return res
    },
    {
      manual: false,
    }
  )

  // 类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug':
        return <BugOutlined />
      case 'feature':
        return <BulbOutlined />
      case 'improvement':
        return <ToolOutlined />
      default:
        return <QuestionCircleOutlined />
    }
  }

  // 类型文本
  const getTypeText = (type: string) => {
    const map: Record<string, string> = {
      bug: 'Bug',
      feature: '功能请求',
      improvement: '改进建议',
      other: '其他',
    }
    return map[type] || type
  }

  // 状态文本
  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      pending: '待处理',
      in_progress: '处理中',
      resolved: '已解决',
      closed: '已关闭',
      rejected: '已拒绝',
    }
    return map[status] || status
  }

  // 状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange'
      case 'in_progress':
        return 'blue'
      case 'resolved':
        return 'green'
      case 'closed':
        return 'default'
      case 'rejected':
        return 'red'
      default:
        return 'default'
    }
  }

  // 优先级文本
  const getPriorityText = (priority: string) => {
    const map: Record<string, string> = {
      critical: '紧急',
      high: '高',
      medium: '中',
      low: '低',
    }
    return map[priority] || priority
  }

  // 优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'red'
      case 'high':
        return 'orange'
      case 'medium':
        return 'blue'
      case 'low':
        return 'default'
      default:
        return 'default'
    }
  }

  // 热门功能请求表格列
  const topVotedColumns = [
    {
      title: '排名',
      key: 'rank',
      width: 70,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '投票数',
      dataIndex: 'votes',
      key: 'votes',
      width: 100,
      align: 'center' as const,
      sorter: (a: any, b: any) => b.votes - a.votes,
      render: (votes: number) => (
        <div className="flex items-center justify-center gap-1">
          <LikeOutlined className="text-blue-500" />
          <span className="font-medium">{votes}</span>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
  ]

  // 最近解决表格列
  const recentResolvedColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => (
        <Tag icon={getTypeIcon(type)}>{getTypeText(type)}</Tag>
      ),
    },
    {
      title: '解决时间',
      dataIndex: 'resolvedAt',
      key: 'resolvedAt',
      width: 160,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '解决人',
      dataIndex: 'resolvedBy',
      key: 'resolvedBy',
      width: 120,
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">反馈统计</h1>
        <p className="text-gray-500 mt-1">
          查看反馈的整体统计数据和趋势分析
        </p>
      </div>

      {/* 总览统计卡片 */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总反馈数"
              value={data?.total || 0}
              prefix={<QuestionCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bug 报告"
              value={data?.byType?.find((item) => item.type === 'bug')?.count || 0}
              prefix={<BugOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="功能请求"
              value={data?.byType?.find((item) => item.type === 'feature')?.count || 0}
              prefix={<BulbOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="改进建议"
              value={data?.byType?.find((item) => item.type === 'improvement')?.count || 0}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-4">
        {/* 按状态分布 */}
        <Col xs={24} lg={12}>
          <Card
            title="状态分布"
            loading={loading}
            extra={<ClockCircleOutlined />}
          >
            {data?.byStatus && data.byStatus.length > 0 ? (
              <div className="space-y-3">
                {data.byStatus.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag color={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </Tag>
                    </div>
                    <span className="font-medium text-lg">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <Empty description="暂无数据" />
            )}
          </Card>
        </Col>

        {/* Bug 优先级分布 */}
        <Col xs={24} lg={12}>
          <Card
            title="Bug 优先级分布"
            loading={loading}
            extra={<BugOutlined />}
          >
            {data?.byPriority && data.byPriority.length > 0 ? (
              <div className="space-y-3">
                {data.byPriority.map((item) => (
                  <div key={item.priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag color={getPriorityColor(item.priority)}>
                        {getPriorityText(item.priority)}
                      </Tag>
                    </div>
                    <span className="font-medium text-lg">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <Empty description="暂无数据" />
            )}
          </Card>
        </Col>
      </Row>

      {/* 热门功能请求 */}
      <Card
        title="热门功能请求 Top 10"
        className="mb-4"
        loading={loading}
        extra={<LikeOutlined />}
      >
        <Table
          columns={topVotedColumns}
          dataSource={data?.topVoted || []}
          rowKey="_id"
          pagination={false}
          locale={{ emptyText: '暂无数据' }}
        />
      </Card>

      {/* 最近解决 */}
      <Card
        title="最近解决 Top 10"
        loading={loading}
        extra={<CheckCircleOutlined />}
      >
        <Table
          columns={recentResolvedColumns}
          dataSource={data?.recentResolved || []}
          rowKey="_id"
          pagination={false}
          locale={{ emptyText: '暂无数据' }}
        />
      </Card>
    </div>
  )
}

export default FeedbackStatisticsPage

