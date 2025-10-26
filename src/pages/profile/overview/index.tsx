import React from 'react'
import { Card, Avatar, Tag, Button, Spin, Row, Col, Statistic } from 'antd'
import {
  UserOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  StarOutlined,
  DeleteOutlined,
  BarChartOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { stateType } from '@/store'
import { getUserStatistics } from '@/api/modules/user'
import { useRequest } from 'ahooks'

interface StatisticsData {
  questionStats: {
    total: number
    published: number
    starred: number
    deleted: number
    totalAnswers: number
  }
}

const ProfileOverview: React.FC = () => {
  const navigate = useNavigate()
  const user = useSelector((state: stateType) => state.user)

  const { data: statistics, loading } = useRequest(
    async () => {
      return await getUserStatistics()
    },
    {
      manual: false,
    }
  )

  return loading ? (
    <div className="flex items-center justify-center min-h-[400px]">
      <Spin size="large" tip="加载中..." />
    </div>
  ) : (
    <div className="space-y-4 md:space-y-6">
      {/* 欢迎卡片 */}
      <Card className="shadow-md">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <Avatar
            size={80}
            src={user.avatar || undefined}
            icon={!user.avatar && <UserOutlined />}
            className="bg-blue-500 mx-auto sm:mx-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user.nickname || user.username}
              </h2>
              <Tag
                icon={user.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                color={user.isActive ? 'success' : 'error'}
              >
                {user.isActive ? '活跃' : '未激活'}
              </Tag>
            </div>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-1">
              邮箱：{user.username}
            </p>
            {user.bio && (
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-3">
                {user.bio}
              </p>
            )}
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-500">
              加入时间：{new Date(user.createdAt).toLocaleDateString()}
            </p>
            {user.lastLoginAt && (
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-500">
                最后登录：{new Date(user.lastLoginAt).toLocaleString()}
              </p>
            )}
          </div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate('/profile/info')}
            className="w-full sm:w-auto mt-4 sm:mt-0"
          >
            编辑资料
          </Button>
        </div>
      </Card>

      {/* 数据概览 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="shadow-md">
            <Statistic
              title="总问卷数"
              value={statistics?.questionStats.total || 0}
              prefix={<FileTextOutlined className="text-blue-500" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="shadow-md">
            <Statistic
              title="已发布"
              value={statistics?.questionStats.published || 0}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="shadow-md">
            <Statistic
              title="已收藏"
              value={statistics?.questionStats.starred || 0}
              prefix={<StarOutlined className="text-yellow-500" />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="shadow-md">
            <Statistic
              title="总回答数"
              value={statistics?.questionStats.totalAnswers || 0}
              prefix={<BarChartOutlined className="text-purple-500" />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 快捷操作 */}
      <Card title="快捷操作" className="shadow-md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Button
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate('/manage/list')}
            className="h-16 md:h-20 text-xs md:text-sm"
          >
            <span className="hidden sm:inline">创建问卷</span>
            <span className="sm:hidden">创建</span>
          </Button>
          <Button
            size="large"
            icon={<FileTextOutlined />}
            onClick={() => navigate('/manage/list')}
            className="h-16 md:h-20 text-xs md:text-sm"
          >
            <span className="hidden sm:inline">我的问卷</span>
            <span className="sm:hidden">问卷</span>
          </Button>
          <Button
            size="large"
            icon={<StarOutlined />}
            onClick={() => navigate('/manage/star')}
            className="h-16 md:h-20 text-xs md:text-sm"
          >
            <span className="hidden sm:inline">我的收藏</span>
            <span className="sm:hidden">收藏</span>
          </Button>
          <Button
            size="large"
            icon={<BarChartOutlined />}
            onClick={() => navigate('/profile/statistics')}
            className="h-16 md:h-20 text-xs md:text-sm"
          >
            <span className="hidden sm:inline">数据统计</span>
            <span className="sm:hidden">统计</span>
          </Button>
        </div>
      </Card>

      {/* 功能入口 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title="基本信息"
            extra={<Button type="link" onClick={() => navigate('/profile/info')}>编辑</Button>}
            className="shadow-md"
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">昵称：</span>
                <span className="font-medium">{user.nickname}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">邮箱：</span>
                <span className="font-medium">{user.username}</span>
              </div>
              {user.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-600">手机：</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="账户安全"
            extra={<Button type="link" onClick={() => navigate('/profile/security')}>管理</Button>}
            className="shadow-md"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">登录密码：</span>
                <Button size="small" onClick={() => navigate('/profile/security')}>
                  修改密码
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">账户状态：</span>
                <Tag color={user.isActive ? 'success' : 'error'}>
                  {user.isActive ? '正常' : '未激活'}
                </Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ProfileOverview

