/**
 * 管理后台 - 模板统计数据
 */
import React, { useEffect, useState } from 'react'
import { LoadingSpin } from '@/components/loading-spin'
import { Card, Row, Col, Statistic, Table, Tag, Progress, Empty, Space } from 'antd'
import {
  FileTextOutlined,
  CrownOutlined,
  UserOutlined,
  StarFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined,
  EyeOutlined,
  HeartOutlined,
} from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { getTemplateStatistics } from '@/api/modules/admin-template'
import type { TemplateStatistics } from '@/api/modules/admin-template'
import { TEMPLATE_CATEGORIES } from '@/constants/template-categories'

const TemplateStatisticsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<TemplateStatistics | null>(null)

  const { loading } = useRequest(
    async () => {
      const data = await getTemplateStatistics()
      setStatistics(data)
      return data
    },
    {
      onError: () => {
        // 错误处理
      }
    }
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpin tip="加载统计数据中..." />
      </div>
    )
  }

  if (!statistics) {
    return <Empty description="暂无统计数据" />
  }

  // 分类统计表格列
  const categoryColumns = [
    {
      title: '分类',
      dataIndex: '_id',
      key: 'category',
      render: (categoryKey: string) => {
        const category = TEMPLATE_CATEGORIES[categoryKey as keyof typeof TEMPLATE_CATEGORIES]
        return category ? (
          <Space>
            <span>{category.emoji}</span>
            <span>{category.label}</span>
          </Space>
        ) : categoryKey
      },
    },
    {
      title: '模板数量',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
      render: (count: number) => (
        <Tag color="blue">{count} 个</Tag>
      ),
    },
    {
      title: '平均使用次数',
      dataIndex: 'avgUseCount',
      key: 'avgUseCount',
      sorter: (a: any, b: any) => a.avgUseCount - b.avgUseCount,
      render: (avg: number) => Math.round(avg),
    },
    {
      title: '占比',
      key: 'percentage',
      render: (_: any, record: any) => {
        const percentage = (record.count / statistics.total * 100).toFixed(1)
        return (
          <div className="flex items-center gap-2">
            <Progress 
              percent={parseFloat(percentage)} 
              size="small" 
              style={{ width: 100 }}
              showInfo={false}
            />
            <span className="text-sm">{percentage}%</span>
          </div>
        )
      },
    },
  ]

  // Top模板表格列
  const topTemplatesColumns = [
    {
      title: '排名',
      key: 'rank',
      width: 70,
      render: (_: any, __: any, index: number) => {
        const colors = ['#FFD700', '#C0C0C0', '#CD7F32']
        const icons = [<TrophyOutlined key="1" />, <TrophyOutlined key="2" />, <TrophyOutlined key="3" />]
        return (
          <span style={{ color: colors[index] || '#666' }}>
            {index < 3 ? icons[index] : `#${index + 1}`}
          </span>
        )
      },
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '使用次数',
      dataIndex: 'useCount',
      key: 'useCount',
      sorter: (a: any, b: any) => a.useCount - b.useCount,
      render: (count: number) => (
        <span className="font-semibold text-blue-600">{count}</span>
      ),
    },
    {
      title: '点赞数',
      dataIndex: 'likeCount',
      key: 'likeCount',
      render: (count: number) => (
        <span className="text-red-600">
          <HeartOutlined /> {count}
        </span>
      ),
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      render: (count: number) => (
        <span className="text-green-600">
          <EyeOutlined /> {count}
        </span>
      ),
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <span className="text-yellow-600">
          <StarFilled /> {rating.toFixed(1)}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold mb-2">统计数据</h1>
        <p className="text-gray-600">
          全面的模板数据统计与分析，洞察模板市场运营情况
        </p>
      </div>

      {/* 总览统计卡片 */}
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总模板数"
              value={statistics.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="官方模板"
              value={statistics.official}
              prefix={<CrownOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="用户创建"
              value={statistics.userCreated}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="精选模板"
              value={statistics.featured}
              prefix={<StarFilled />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 审核状态统计 */}
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="待审核"
              value={statistics.pending}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="已通过"
              value={statistics.approved}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="已拒绝"
              value={statistics.rejected}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#f5222d' }}
              suffix="个"
            />
          </Card>
        </Col>
      </Row>

      {/* 按分类统计 */}
      <Card title="📊 分类统计" className="shadow-sm">
        <Table
          columns={categoryColumns}
          dataSource={statistics.byCategory}
          rowKey="_id"
          pagination={false}
          size="middle"
        />
      </Card>

      {/* Top 10 模板 */}
      <Card title="🏆 最受欢迎的模板 Top 10" className="shadow-sm">
        <Table
          columns={topTemplatesColumns}
          dataSource={statistics.topTemplates}
          rowKey="_id"
          pagination={false}
          size="middle"
        />
      </Card>

      {/* 数据洞察 */}
      <Card title="💡 数据洞察" className="shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
            <div className="flex-1">
              <div className="font-medium">官方模板占比</div>
              <div className="text-sm text-gray-600">
                {((statistics.official / statistics.total) * 100).toFixed(1)}% 的模板为官方发布
              </div>
            </div>
            <Progress 
              type="circle" 
              percent={parseFloat(((statistics.official / statistics.total) * 100).toFixed(1))} 
              width={60}
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-green-50 rounded">
            <div className="flex-1">
              <div className="font-medium">精选率</div>
              <div className="text-sm text-gray-600">
                {((statistics.featured / statistics.total) * 100).toFixed(1)}% 的模板被设为精选
              </div>
            </div>
            <Progress 
              type="circle" 
              percent={parseFloat(((statistics.featured / statistics.total) * 100).toFixed(1))} 
              width={60}
              strokeColor="#52c41a"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-orange-50 rounded">
            <div className="flex-1">
              <div className="font-medium">待审核比例</div>
              <div className="text-sm text-gray-600">
                {statistics.pending > 0 
                  ? `有 ${statistics.pending} 个模板等待审核` 
                  : '当前无待审核模板'}
              </div>
            </div>
            {statistics.pending > 0 && (
              <Tag color="orange" className="text-lg px-4 py-1">
                {statistics.pending}
              </Tag>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TemplateStatisticsPage

