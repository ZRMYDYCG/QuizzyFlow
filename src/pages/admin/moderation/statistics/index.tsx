/**
 * 管理后台 - 审核统计
 */
import React from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Empty,
  Spin,
  Tag,
} from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  RobotOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { useRequest } from 'ahooks'
import {
  getModerationStatistics,
  type ModerationStatistics,
} from '@/api/modules/admin-moderation'

const ModerationStatisticsPage: React.FC = () => {
  // 加载统计数据
  const { data: statistics, loading } = useRequest(
    async () => {
      return await getModerationStatistics()
    },
    {
      onError: () => {
        // message.error('加载统计数据失败')
      },
    }
  )

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

  // 计算通过率
  const approvalRate = statistics.total > 0
    ? (((statistics.approved + statistics.autoApproved) / statistics.total) * 100).toFixed(1)
    : '0'

  // 计算拒绝率
  const rejectionRate = statistics.total > 0
    ? ((statistics.rejected / statistics.total) * 100).toFixed(1)
    : '0'

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold mb-2">审核统计</h1>
        <p className="text-gray-600">
          内容审核系统的全面数据统计与分析
        </p>
      </div>

      {/* 总览统计卡片 */}
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总审核数"
              value={statistics.total}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待审核"
              value={statistics.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix={`/ ${statistics.total}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已通过"
              value={statistics.approved}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${statistics.total}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已拒绝"
              value={statistics.rejected}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
              suffix={`/ ${statistics.total}`}
            />
          </Card>
        </Col>
      </Row>

      {/* 自动审核效率 */}
      <Card title="自动审核效率">
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <div className="text-center py-6">
              <div className="text-6xl font-bold text-blue-600 mb-4">
                <RobotOutlined className="mr-3" />
                {statistics.autoApprovalRate}%
              </div>
              <div className="text-lg text-gray-600">自动审核通过率</div>
              <div className="text-sm text-gray-500 mt-2">
                {statistics.autoApproved} / {statistics.total} 条内容自动通过
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="space-y-4 py-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">总通过率</span>
                  <span className="font-semibold">{approvalRate}%</span>
                </div>
                <Progress
                  percent={Number(approvalRate)}
                  strokeColor="#52c41a"
                  showInfo={false}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">拒绝率</span>
                  <span className="font-semibold">{rejectionRate}%</span>
                </div>
                <Progress
                  percent={Number(rejectionRate)}
                  strokeColor="#ff4d4f"
                  showInfo={false}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">待审核率</span>
                  <span className="font-semibold">
                    {statistics.total > 0
                      ? ((statistics.pending / statistics.total) * 100).toFixed(1)
                      : '0'}%
                  </span>
                </div>
                <Progress
                  percent={
                    statistics.total > 0
                      ? Number(((statistics.pending / statistics.total) * 100).toFixed(1))
                      : 0
                  }
                  strokeColor="#faad14"
                  showInfo={false}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 风险等级分布 */}
      <Card title="风险等级分布">
        <Row gutter={16}>
          {statistics.byRiskLevel.map((item) => {
            const riskLevelMap: Record<string, { label: string; color: string; icon: any }> = {
              high: { label: '高风险', color: 'red', icon: <WarningOutlined /> },
              medium: { label: '中风险', color: 'orange', icon: <ExclamationCircleOutlined /> },
              low: { label: '低风险', color: 'green', icon: <SafetyOutlined /> },
            }
            
            const config = riskLevelMap[item.riskLevel] || {
              label: item.riskLevel,
              color: 'blue',
              icon: <SafetyOutlined />,
            }

            const percentage = statistics.total > 0
              ? ((item.count / statistics.total) * 100).toFixed(1)
              : '0'

            return (
              <Col xs={24} sm={8} key={item.riskLevel}>
                <Card className="text-center">
                  <div className={`text-4xl mb-2 text-${config.color}-600`}>
                    {config.icon}
                  </div>
                  <div className="text-lg font-semibold mb-1">{config.label}</div>
                  <div className="text-3xl font-bold mb-2">{item.count}</div>
                  <Progress
                    percent={Number(percentage)}
                    strokeColor={config.color === 'red' ? '#ff4d4f' : config.color === 'orange' ? '#faad14' : '#52c41a'}
                    size="small"
                  />
                  <div className="text-sm text-gray-500 mt-2">
                    占比 {percentage}%
                  </div>
                </Card>
              </Col>
            )
          })}
        </Row>
      </Card>

      {/* 内容类型分布 */}
      <Card title="内容类型分布">
        <Row gutter={16}>
          {statistics.byContentType.map((item) => {
            const contentTypeMap: Record<string, { label: string; color: string }> = {
              question: { label: '问卷', color: 'blue' },
              template: { label: '模板', color: 'purple' },
              comment: { label: '评论', color: 'cyan' },
            }

            const config = contentTypeMap[item.contentType] || {
              label: item.contentType,
              color: 'default',
            }

            const percentage = statistics.total > 0
              ? ((item.count / statistics.total) * 100).toFixed(1)
              : '0'

            return (
              <Col xs={24} sm={8} key={item.contentType}>
                <Card className="text-center">
                  <Tag color={config.color} className="text-lg px-4 py-2 mb-3">
                    {config.label}
                  </Tag>
                  <div className="text-3xl font-bold mb-2">{item.count}</div>
                  <Progress
                    percent={Number(percentage)}
                    size="small"
                  />
                  <div className="text-sm text-gray-500 mt-2">
                    占比 {percentage}%
                  </div>
                </Card>
              </Col>
            )
          })}
        </Row>
      </Card>

      {/* 数据说明 */}
      <Card title="数据说明">
        <div className="space-y-2 text-sm text-gray-600">
          <div>• <span className="font-semibold">总审核数：</span>系统审核的所有内容总数</div>
          <div>• <span className="font-semibold">自动审核通过率：</span>由AI自动审核通过的内容占比，越高表示系统越智能</div>
          <div>• <span className="font-semibold">风险等级：</span>根据敏感词、内容质量等因素自动计算</div>
          <div>• <span className="font-semibold">高风险内容：</span>包含多个敏感词或风险评分超过50分</div>
          <div>• <span className="font-semibold">审核策略：</span>低风险自动通过，中风险延迟审核，高风险立即人工审核</div>
        </div>
      </Card>
    </div>
  )
}

export default ModerationStatisticsPage

