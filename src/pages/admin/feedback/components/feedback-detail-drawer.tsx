/**
 * 反馈详情抽屉
 */
import React, { useState } from 'react'
import {
  Drawer,
  Descriptions,
  Tag,
  Button,
  Space,
  Form,
  Select,
  Input,
  message,
  Timeline,
  Empty,
  Divider,
  Avatar,
} from 'antd'
import {
  BugOutlined,
  BulbOutlined,
  ToolOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { useRequest } from 'ahooks'
import dayjs from 'dayjs'
import {
  updateFeedback,
  replyFeedback,
  type Feedback,
} from '@/api/modules/admin-feedback'

const { TextArea } = Input

interface FeedbackDetailDrawerProps {
  visible: boolean
  feedback: Feedback | null
  onClose: () => void
  onUpdate: () => void
}

const FeedbackDetailDrawer: React.FC<FeedbackDetailDrawerProps> = ({
  visible,
  feedback,
  onClose,
  onUpdate,
}) => {
  const [form] = Form.useForm()
  const [replyForm] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)

  // 更新反馈
  const { loading: updating, run: handleUpdate } = useRequest(
    async (values) => {
      if (!feedback) return
      await updateFeedback(feedback._id, values)
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('更新成功')
        setIsEditing(false)
        onUpdate()
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '更新失败')
      },
    }
  )

  // 回复反馈
  const { loading: replying, run: handleReply } = useRequest(
    async (values) => {
      if (!feedback) return
      await replyFeedback(feedback._id, values.content)
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('回复成功')
        replyForm.resetFields()
        onUpdate()
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '回复失败')
      },
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

  if (!feedback) return null

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          {getTypeIcon(feedback.type)}
          <span>反馈详情</span>
        </div>
      }
      placement="right"
      width={720}
      open={visible}
      onClose={onClose}
      extra={
        <Space>
          {isEditing ? (
            <>
              <Button onClick={() => setIsEditing(false)}>取消</Button>
              <Button
                type="primary"
                loading={updating}
                onClick={() => form.submit()}
              >
                保存
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={() => setIsEditing(true)}>
              编辑
            </Button>
          )}
        </Space>
      }
    >
      <div className="space-y-6">
        {/* 基本信息 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">基本信息</h3>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="标题">
              {feedback.title}
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              <Tag color={getTypeColor(feedback.type)} icon={getTypeIcon(feedback.type)}>
                {getTypeText(feedback.type)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="描述">
              <div className="whitespace-pre-wrap">{feedback.description}</div>
            </Descriptions.Item>
            <Descriptions.Item label="提交者">
              {feedback.author}
            </Descriptions.Item>
            {feedback.authorEmail && (
              <Descriptions.Item label="联系邮箱">
                {feedback.authorEmail}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="提交时间">
              {dayjs(feedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="投票数">
              {feedback.votes}
            </Descriptions.Item>
            {feedback.tags && feedback.tags.length > 0 && (
              <Descriptions.Item label="标签">
                {feedback.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>

        {/* 状态管理 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">状态管理</h3>
          {isEditing ? (
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                status: feedback.status,
                priority: feedback.priority,
                assignedTo: feedback.assignedTo,
              }}
              onFinish={handleUpdate}
            >
              <Form.Item label="状态" name="status">
                <Select
                  options={[
                    { label: '待处理', value: 'pending' },
                    { label: '处理中', value: 'in_progress' },
                    { label: '已解决', value: 'resolved' },
                    { label: '已关闭', value: 'closed' },
                    { label: '已拒绝', value: 'rejected' },
                  ]}
                />
              </Form.Item>
              <Form.Item label="优先级" name="priority">
                <Select
                  options={[
                    { label: '紧急', value: 'critical' },
                    { label: '高', value: 'high' },
                    { label: '中', value: 'medium' },
                    { label: '低', value: 'low' },
                  ]}
                />
              </Form.Item>
              <Form.Item label="分配给" name="assignedTo">
                <Input placeholder="输入开发人员用户名" />
              </Form.Item>
            </Form>
          ) : (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="状态">
                <Tag color={getStatusColor(feedback.status)}>
                  {getStatusText(feedback.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="优先级">
                <Tag color={getPriorityColor(feedback.priority)}>
                  {getPriorityText(feedback.priority)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="分配给">
                {feedback.assignedTo || '-'}
              </Descriptions.Item>
              {feedback.resolvedAt && (
                <>
                  <Descriptions.Item label="解决时间">
                    {dayjs(feedback.resolvedAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Descriptions.Item>
                  <Descriptions.Item label="解决人">
                    {feedback.resolvedBy || '-'}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          )}
        </div>

        {/* 环境信息 */}
        {(feedback.browserInfo || feedback.osInfo) && (
          <div>
            <h3 className="text-lg font-semibold mb-3">环境信息</h3>
            <Descriptions column={1} bordered>
              {feedback.browserInfo && (
                <Descriptions.Item label="浏览器">
                  {feedback.browserInfo}
                </Descriptions.Item>
              )}
              {feedback.osInfo && (
                <Descriptions.Item label="操作系统">
                  {feedback.osInfo}
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}

        {/* 截图 */}
        {feedback.screenshots && feedback.screenshots.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">截图</h3>
            <div className="grid grid-cols-2 gap-3">
              {feedback.screenshots.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`截图 ${index + 1}`}
                  className="rounded border w-full h-auto cursor-pointer hover:opacity-80"
                  onClick={() => window.open(url, '_blank')}
                />
              ))}
            </div>
          </div>
        )}

        <Divider />

        {/* 回复列表 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">回复记录</h3>
          {feedback.replies && feedback.replies.length > 0 ? (
            <Timeline>
              {feedback.replies.map((reply, index) => (
                <Timeline.Item
                  key={index}
                  dot={<Avatar size="small" icon={<UserOutlined />} />}
                >
                  <div className="mb-2">
                    <span className="font-medium">{reply.author}</span>
                    <span className="text-gray-400 text-sm ml-2">
                      <ClockCircleOutlined className="mr-1" />
                      {dayjs(reply.createdAt).format('YYYY-MM-DD HH:mm')}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded whitespace-pre-wrap">
                    {reply.content}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <Empty description="暂无回复" />
          )}
        </div>

        {/* 添加回复 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">添加回复</h3>
          <Form form={replyForm} onFinish={handleReply}>
            <Form.Item
              name="content"
              rules={[{ required: true, message: '请输入回复内容' }]}
            >
              <TextArea
                rows={4}
                placeholder="输入回复内容..."
                showCount
                maxLength={1000}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={replying}
              >
                提交回复
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Drawer>
  )
}

export default FeedbackDetailDrawer

