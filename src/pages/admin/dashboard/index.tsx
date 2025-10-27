import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Table, Tag } from 'antd'
import {
  UserOutlined,
  FileTextOutlined,
  FormOutlined,
  RiseOutlined,
} from '@ant-design/icons'
import { getSystemStatisticsAPI, getUserActivityAPI, getRecentLogsAPI } from '@/api/modules/admin'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ColumnsType } from 'antd/es/table'
import { useRequest } from 'ahooks'

/**
 * 管理后台 - 数据大盘
 */
const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<any>(null)
  const [userGrowth, setUserGrowth] = useState<any[]>([])
  const [recentLogs, setRecentLogs] = useState<any[]>([])

  const { run: loadData, loading } = useRequest(
    async () => {
      const [statsRes, activityRes, logsRes] = await Promise.all([
        getSystemStatisticsAPI(),
        getUserActivityAPI(30),
        getRecentLogsAPI(10),
      ])
      return { statsRes, activityRes, logsRes }
    },
    {
      manual: true,
      onSuccess: (result) => {
        console.log('📊 Dashboard API 返回数据:', result)
        console.log('  - statsRes:', result.statsRes)
        console.log('  - activityRes:', result.activityRes)
        console.log('  - activityRes 是数组:', Array.isArray(result.activityRes))
        
        setStatistics(result.statsRes)
        // 确保 activityRes 是数组
        setUserGrowth(Array.isArray(result.activityRes) ? result.activityRes : [])
        setRecentLogs(Array.isArray(result.logsRes) ? result.logsRes : [])
      },
      onError: (error) => {
        console.error('Failed to load dashboard data:', error)
      },
    }
  )

  useEffect(() => {
    loadData()
  }, [])

  // 日志表格列
  const logColumns: ColumnsType<any> = [
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text) => {
        const actionMap: Record<string, string> = {
          create: '创建',
          update: '更新',
          delete: '删除',
          ban: '封禁',
          login: '登录',
        }
        return actionMap[text] || text
      },
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      render: (text) => {
        const colorMap: Record<string, string> = {
          user: 'blue',
          question: 'green',
          role: 'purple',
          permission: 'orange',
        }
        return <Tag color={colorMap[text]}>{text}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'success' ? 'success' : 'error'}>
          {status === 'success' ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '时间',
      dataIndex: 'operatedAt',
      key: 'operatedAt',
      render: (date) => new Date(date).toLocaleString('zh-CN'),
    },
  ]

  // 用户增长图表数据
  const userGrowthData = Array.isArray(userGrowth) 
    ? userGrowth.map((item) => ({
        date: item._id,
        count: item.count,
      }))
    : []

  // 角色分布图表数据
  const roleDistributionData = statistics?.users?.byRole?.map((item: any) => ({
    role: item._id,
    count: item.count,
  })) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">数据大盘</h1>
        <p className="text-gray-600">系统运营数据概览</p>
      </div>

      {/* 关键指标卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="总用户数"
              value={statistics?.users?.total || 0}
              prefix={<UserOutlined />}
              suffix={
                <span className="text-sm text-green-500 ml-2">
                  <RiseOutlined /> 今日+{statistics?.users?.todayNew || 0}
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="总问卷数"
              value={statistics?.questions?.total || 0}
              prefix={<FileTextOutlined />}
              suffix={
                <span className="text-sm text-green-500 ml-2">
                  <RiseOutlined /> 今日+{statistics?.questions?.todayNew || 0}
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="总答卷数"
              value={statistics?.answers?.total || 0}
              prefix={<FormOutlined />}
              suffix={
                <span className="text-sm text-green-500 ml-2">
                  <RiseOutlined /> 今日+{statistics?.answers?.todayNew || 0}
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="活跃用户"
              value={Array.isArray(userGrowth) ? userGrowth.reduce((sum, item) => sum + item.count, 0) : 0}
              prefix={<UserOutlined />}
              suffix={<span className="text-sm text-gray-500">近30天</span>}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="用户增长趋势（近30天）" loading={loading}>
            {userGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
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
                    name="新增用户"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                暂无数据
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="用户角色分布" loading={loading}>
            {roleDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roleDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#1890ff" name="用户数" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                暂无数据
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 最近操作日志 */}
      <Card title="最近操作记录" loading={loading}>
        <Table
          columns={logColumns}
          dataSource={recentLogs}
          rowKey="_id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}

export default Dashboard

