/**
 * 管理后台 - 待审核队列
 * 智能审核系统 - 三层审核机制
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
  Badge,
  Tooltip,
  Form,
} from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  SafetyOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useRequest } from 'ahooks'
import dayjs from 'dayjs'
import {
  getModerationQueue,
  reviewContent,
  batchReviewContent,
  type ModerationRecord,
  type QueryModerationParams,
} from '@/api/modules/admin-moderation'

const ModerationQueuePage: React.FC = () => {
  // 查询参数
  const [status, setStatus] = useState<string>('pending')
  const [contentType, setContentType] = useState<string>('all')
  const [riskLevel, setRiskLevel] = useState<string>('all')
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 数据状态
  const [records, setRecords] = useState<ModerationRecord[]>([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 审核弹窗
  const [reviewModalVisible, setReviewModalVisible] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve')
  const [selectedRecord, setSelectedRecord] = useState<ModerationRecord | null>(null)
  const [reviewForm] = Form.useForm()

  // 加载审核队列
  const { loading, run: loadQueue } = useRequest(
    async () => {
      const params: QueryModerationParams = {
        page,
        pageSize,
        status: status === 'all' ? undefined : status as any,
        contentType: contentType === 'all' ? undefined : contentType as any,
        riskLevel: riskLevel === 'all' ? undefined : riskLevel as any,
        keyword: keyword || undefined,
      }

      const res = await getModerationQueue(params)
      return res
    },
    {
      manual: false,
      refreshDeps: [page, pageSize, status, contentType, riskLevel, keyword],
      onSuccess: (res: any) => {
        setRecords(res.list)
        setTotal(res.total)
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '加载失败')
      },
    }
  )

  // 获取风险等级标签
  const getRiskLevelTag = (level: string) => {
    switch (level) {
      case 'high':
        return (
          <Tag color="red" icon={<ExclamationCircleOutlined />}>
            高风险
          </Tag>
        )
      case 'medium':
        return (
          <Tag color="orange" icon={<WarningOutlined />}>
            中风险
          </Tag>
        )
      case 'low':
        return (
          <Tag color="green" icon={<SafetyOutlined />}>
            低风险
          </Tag>
        )
      default:
        return <Tag>{level}</Tag>
    }
  }

  // 获取状态标签
  const getStatusTag = (status: string, isAutoReviewed: boolean) => {
    switch (status) {
      case 'pending':
        return <Tag color="gold">待审核</Tag>
      case 'approved':
        return <Tag color="success">已通过</Tag>
      case 'rejected':
        return <Tag color="error">已拒绝</Tag>
      case 'auto_approved':
        return (
          <Badge status="success" text={
            <span className="text-green-600">自动通过</span>
          } />
        )
      default:
        return <Tag>{status}</Tag>
    }
  }

  // 打开审核弹窗
  const handleOpenReviewModal = (record: ModerationRecord, action: 'approve' | 'reject') => {
    setSelectedRecord(record)
    setReviewAction(action)
    setReviewModalVisible(true)
    reviewForm.resetFields()
  }

  // 提交审核
  const handleSubmitReview = async () => {
    if (!selectedRecord) return

    try {
      const values = await reviewForm.validateFields()
      await reviewContent(
        selectedRecord._id,
        reviewAction,
        reviewAction === 'reject' ? values.reason : undefined
      )
      message.success(reviewAction === 'approve' ? '审核通过' : '已拒绝')
      setReviewModalVisible(false)
      setSelectedRecord(null)
      loadQueue()
    } catch (error: any) {
      if (error.errorFields) return // 表单验证错误
      message.error(error.response?.data?.message || '审核失败')
    }
  }

  // 快速通过（单个）
  const handleQuickApprove = async (record: ModerationRecord) => {
    try {
      await reviewContent(record._id, 'approve')
      message.success('审核通过')
      loadQueue()
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败')
    }
  }

  // 批量审核
  const handleBatchReview = (action: 'approve' | 'reject') => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要审核的内容')
      return
    }

    Modal.confirm({
      title: `确认批量${action === 'approve' ? '通过' : '拒绝'}`,
      content: `确定要${action === 'approve' ? '通过' : '拒绝'}选中的 ${selectedRowKeys.length} 条内容吗？`,
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: action === 'reject' },
      onOk: async () => {
        try {
          const result = await batchReviewContent(
            selectedRowKeys as string[],
            action,
            action === 'reject' ? '批量拒绝' : undefined
          )
          message.success(result.message || '批量审核成功')
          setSelectedRowKeys([])
          loadQueue()
        } catch (error: any) {
          message.error(error.response?.data?.message || '批量审核失败')
        }
      },
    })
  }

  // 表格列定义
  const columns: ColumnsType<ModerationRecord> = [
    {
      title: '内容类型',
      dataIndex: 'contentType',
      key: 'contentType',
      width: 100,
      render: (type) => {
        const typeMap: Record<string, { text: string; color: string }> = {
          question: { text: '问卷', color: 'blue' },
          template: { text: '模板', color: 'purple' },
          comment: { text: '评论', color: 'cyan' },
        }
        return <Tag color={typeMap[type]?.color}>{typeMap[type]?.text || type}</Tag>
      },
    },
    {
      title: '内容标题',
      dataIndex: 'contentTitle',
      key: 'contentTitle',
      width: 250,
      ellipsis: true,
      render: (title) => (
        <Tooltip title={title}>
          <span className="font-medium">{title}</span>
        </Tooltip>
      ),
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 120,
    },
    {
      title: '风险等级',
      key: 'riskLevel',
      width: 120,
      sorter: (a, b) => {
        const levelMap: Record<string, number> = { low: 1, medium: 2, high: 3 }
        return levelMap[a.riskLevel] - levelMap[b.riskLevel]
      },
      render: (_, record) => getRiskLevelTag(record.riskLevel),
    },
    {
      title: '风险评分',
      dataIndex: 'riskScore',
      key: 'riskScore',
      width: 100,
      sorter: (a, b) => a.riskScore - b.riskScore,
      render: (score) => (
        <span className={score >= 50 ? 'text-red-600 font-bold' : score >= 25 ? 'text-orange-600' : 'text-green-600'}>
          {score}
        </span>
      ),
    },
    {
      title: '敏感词',
      dataIndex: 'detectedKeywords',
      key: 'detectedKeywords',
      width: 200,
      render: (keywords: string[]) => (
        keywords.length > 0 ? (
          <Space size="small" wrap>
            {keywords.slice(0, 3).map((word, index) => (
              <Tag key={index} color="red" className="text-xs">
                {word}
              </Tag>
            ))}
            {keywords.length > 3 && (
              <Tag className="text-xs">+{keywords.length - 3}</Tag>
            )}
          </Space>
        ) : (
          <span className="text-gray-400">无</span>
        )
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      render: (_, record) => getStatusTag(record.status, record.isAutoReviewed),
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        record.status === 'pending' ? (
          <Space size="small">
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleQuickApprove(record)}
            >
              通过
            </Button>
            <Button
              type="link"
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={() => handleOpenReviewModal(record, 'reject')}
            >
              拒绝
            </Button>
          </Space>
        ) : (
          <span className="text-gray-400">已处理</span>
        )
      ),
    },
  ]

  // 行选择配置（只允许选择待审核的）
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    getCheckboxProps: (record: ModerationRecord) => ({
      disabled: record.status !== 'pending',
    }),
  }

  return (
    <div className="space-y-4">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold mb-2">待审核队列</h1>
        <p className="text-gray-600">
          智能审核系统自动筛查内容，高风险内容需人工审核确认
        </p>
      </div>

      {/* 筛选栏 */}
      <div className="flex gap-4 flex-wrap items-center">
        <Input
          placeholder="搜索标题或作者"
          allowClear
          style={{ width: 250 }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          prefix={<SearchOutlined />}
        />

        <Select
          placeholder="审核状态"
          style={{ width: 140 }}
          value={status}
          onChange={(value) => setStatus(value)}
          options={[
            { label: '待审核', value: 'pending' },
            { label: '已通过', value: 'approved' },
            { label: '已拒绝', value: 'rejected' },
            { label: '自动通过', value: 'auto_approved' },
            { label: '全部', value: 'all' },
          ]}
        />

        <Select
          placeholder="内容类型"
          style={{ width: 120 }}
          value={contentType}
          onChange={(value) => setContentType(value)}
          options={[
            { label: '全部', value: 'all' },
            { label: '问卷', value: 'question' },
            { label: '模板', value: 'template' },
          ]}
        />

        <Select
          placeholder="风险等级"
          style={{ width: 120 }}
          value={riskLevel}
          onChange={(value) => setRiskLevel(value)}
          options={[
            { label: '全部', value: 'all' },
            { label: '高风险', value: 'high' },
            { label: '中风险', value: 'medium' },
            { label: '低风险', value: 'low' },
          ]}
        />

        <Button icon={<ReloadOutlined />} onClick={loadQueue}>
          刷新
        </Button>
      </div>

      {/* 批量操作 */}
      {selectedRowKeys.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-blue-700 font-medium">
            已选择 {selectedRowKeys.length} 项
          </span>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleBatchReview('approve')}
          >
            批量通过
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleBatchReview('reject')}
          >
            批量拒绝
          </Button>
          <Button onClick={() => setSelectedRowKeys([])}>取消选择</Button>
        </div>
      )}

      {/* 审核队列表格 */}
      <Table
        columns={columns}
        dataSource={records}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 1600 }}
        rowSelection={rowSelection}
        rowClassName={(record) => 
          record.riskLevel === 'high' ? 'bg-red-50' : 
          record.riskLevel === 'medium' ? 'bg-orange-50' : ''
        }
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条审核记录`,
          onChange: (page, pageSize) => {
            setPage(page)
            setPageSize(pageSize)
          },
        }}
      />

      {/* 审核弹窗 */}
      <Modal
        title={reviewAction === 'approve' ? '审核通过' : '拒绝内容'}
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false)
          setSelectedRecord(null)
        }}
        onOk={handleSubmitReview}
        okText="确定"
        cancelText="取消"
        okButtonProps={{ danger: reviewAction === 'reject' }}
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">内容标题</div>
              <div className="font-medium">{selectedRecord.contentTitle}</div>
            </div>
            
            {reviewAction === 'reject' && (
              <Form form={reviewForm} layout="vertical">
                <Form.Item
                  label="拒绝原因"
                  name="reason"
                  rules={[{ required: true, message: '请输入拒绝原因' }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="请说明拒绝原因，将通知内容作者"
                  />
                </Form.Item>
              </Form>
            )}

            {reviewAction === 'approve' && (
              <div className="text-sm text-gray-600">
                <InfoCircleOutlined className="mr-2" />
                通过后，该内容将自动发布并对用户可见
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ModerationQueuePage

