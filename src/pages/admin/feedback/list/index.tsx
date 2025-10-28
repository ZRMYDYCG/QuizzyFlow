/**
 * 管理后台 - 反馈列表
 */
import React, { useState } from 'react'
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  message,
  Tooltip,
  Badge,
  Popconfirm,
} from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  CommentOutlined,
  LikeOutlined,
  BugOutlined,
  BulbOutlined,
  ToolOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useRequest } from 'ahooks'
import dayjs from 'dayjs'
import {
  getAdminFeedbackList,
  deleteFeedback,
  type Feedback,
  type QueryFeedbackParams,
} from '@/api/modules/admin-feedback'
import FeedbackDetailDrawer from '../components/feedback-detail-drawer'

const FeedbackListPage: React.FC = () => {
  // 查询参数
  const [type, setType] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [priority, setPriority] = useState<string>('all')
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 数据状态
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [total, setTotal] = useState(0)
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)

  // 加载反馈列表
  const { loading, run: loadFeedbacks } = useRequest(
    async () => {
      const params: QueryFeedbackParams = {
        page,
        pageSize,
        type: type as any,
        status: status as any,
        priority: priority as any,
        keyword: keyword || undefined,
      }

      const res = await getAdminFeedbackList(params)
      return res
    },
    {
      manual: false,
      refreshDeps: [page, pageSize, type, status, priority, keyword],
      onSuccess: (res) => {
        setFeedbacks(res.list)
        setTotal(res.total)
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '加载失败')
      },
    }
  )

  // 查看详情
  const handleViewDetail = (record: Feedback) => {
    setSelectedFeedback(record)
    setDetailDrawerVisible(true)
  }

  // 删除反馈
  const handleDelete = async (id: string) => {
    try {
      await deleteFeedback(id)
      message.success('删除成功')
      loadFeedbacks()
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除失败')
    }
  }

  // 重置筛选
  const handleReset = () => {
    setType('all')
    setStatus('all')
    setPriority('all')
    setKeyword('')
    setPage(1)
  }

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

  // 类型标签颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug':
        return 'red'
      case 'feature':
        return 'blue'
      case 'improvement':
        return 'green'
      default:
        return 'default'
    }
  }

  // 状态标签颜色
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

  // 优先级标签颜色
  const getPriorityColor = (priority?: string) => {
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

  // 优先级文本
  const getPriorityText = (priority?: string) => {
    const map: Record<string, string> = {
      critical: '紧急',
      high: '高',
      medium: '中',
      low: '低',
    }
    return priority ? map[priority] || priority : '-'
  }

  // 表格列定义
  const columns: ColumnsType<Feedback> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      ellipsis: true,
      render: (text, record) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(record.type)}
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => (
        <Tag color={getTypeColor(type)} icon={getTypeIcon(type)}>
          {getTypeText(type)}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>{getPriorityText(priority)}</Tag>
      ),
    },
    {
      title: '提交者',
      dataIndex: 'author',
      key: 'author',
      width: 120,
    },
    {
      title: '分配给',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      width: 120,
      render: (text) => text || '-',
    },
    {
      title: '投票数',
      dataIndex: 'votes',
      key: 'votes',
      width: 100,
      align: 'center',
      render: (votes) => (
        <Badge count={votes} showZero overflowCount={999}>
          <LikeOutlined className="text-lg" />
        </Badge>
      ),
    },
    {
      title: '回复数',
      dataIndex: 'replies',
      key: 'replies',
      width: 100,
      align: 'center',
      render: (replies) => (
        <Badge count={replies?.length || 0} showZero overflowCount={999}>
          <CommentOutlined className="text-lg" />
        </Badge>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            >
              详情
            </Button>
          </Tooltip>
          <Popconfirm
            title="确定删除此反馈吗？"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">反馈列表</h1>
        <p className="text-gray-500 mt-1">
          查看和管理用户提交的Bug报告、功能请求和改进建议
        </p>
      </div>

      {/* 筛选区 */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <Space wrap size="middle">
          <Input
            placeholder="搜索标题、描述、提交者"
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />

          <Select
            value={type}
            onChange={setType}
            style={{ width: 140 }}
            options={[
              { label: '全部类型', value: 'all' },
              { label: 'Bug', value: 'bug' },
              { label: '功能请求', value: 'feature' },
              { label: '改进建议', value: 'improvement' },
              { label: '其他', value: 'other' },
            ]}
          />

          <Select
            value={status}
            onChange={setStatus}
            style={{ width: 140 }}
            options={[
              { label: '全部状态', value: 'all' },
              { label: '待处理', value: 'pending' },
              { label: '处理中', value: 'in_progress' },
              { label: '已解决', value: 'resolved' },
              { label: '已关闭', value: 'closed' },
              { label: '已拒绝', value: 'rejected' },
            ]}
          />

          <Select
            value={priority}
            onChange={setPriority}
            style={{ width: 140 }}
            options={[
              { label: '全部优先级', value: 'all' },
              { label: '紧急', value: 'critical' },
              { label: '高', value: 'high' },
              { label: '中', value: 'medium' },
              { label: '低', value: 'low' },
            ]}
          />

          <Button icon={<ReloadOutlined />} onClick={loadFeedbacks}>
            刷新
          </Button>

          <Button onClick={handleReset}>重置</Button>
        </Space>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-lg">
        <Table
          columns={columns}
          dataSource={feedbacks}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPage(page)
              setPageSize(pageSize)
            },
          }}
        />
      </div>

      {/* 详情抽屉 */}
      <FeedbackDetailDrawer
        visible={detailDrawerVisible}
        feedback={selectedFeedback}
        onClose={() => {
          setDetailDrawerVisible(false)
          setSelectedFeedback(null)
        }}
        onUpdate={() => {
          loadFeedbacks()
          setDetailDrawerVisible(false)
        }}
      />
    </div>
  )
}

export default FeedbackListPage

