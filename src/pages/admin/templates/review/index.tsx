/**
 * 管理后台 - 模板审核中心
 */
import React, { useState, useEffect } from 'react'
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Tag, 
  Modal, 
  Form,
  message,
  Badge,
  Image,
  Card,
  Radio,
  Tooltip,
} from 'antd'
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  CrownOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useRequest } from 'ahooks'
import dayjs from 'dayjs'
import {
  getAdminTemplateList,
  approveTemplate,
} from '@/api/modules/admin-template'
import { TEMPLATE_CATEGORIES } from '@/constants/template-categories'
import { QUESTIONNAIRE_TYPE_NAMES, QUESTIONNAIRE_TYPE_COLORS } from '@/constants/questionnaire-types'
import type { Template } from '@/types/template'
import TemplateDetailDrawer from '../components/template-detail-drawer'

const { Search } = Input
const { TextArea } = Input

const TemplateReviewPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('pending')
  
  // 审核弹窗
  const [approveModalVisible, setApproveModalVisible] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [form] = Form.useForm()
  
  // 详情抽屉
  const [detailVisible, setDetailVisible] = useState(false)

  // 加载模板列表
  const { run: loadTemplates, loading } = useRequest(
    async () => {
      return await getAdminTemplateList({
        page,
        pageSize,
        keyword,
        approvalStatus: statusFilter as any,
      })
    },
    {
      manual: true,
      onSuccess: (result) => {
        setTemplates(result.list || [])
        setTotal(result.total || 0)
      },
      onError: () => {
        message.error('加载模板列表失败')
      },
    }
  )

  useEffect(() => {
    loadTemplates()
  }, [page, pageSize, keyword, statusFilter])

  // 搜索
  const handleSearch = (value: string) => {
    setKeyword(value)
    setPage(1)
  }

  // 打开审核弹窗
  const showApproveModal = (template: Template) => {
    setSelectedTemplate(template)
    setApproveModalVisible(true)
    form.resetFields()
  }

  // 提交审核
  const handleApprove = async (values: any) => {
    if (!selectedTemplate) return

    try {
      await approveTemplate(selectedTemplate._id, {
        action: values.action,
        reason: values.reason,
      })
      message.success(values.action === 'approve' ? '审核通过' : '审核拒绝')
      setApproveModalVisible(false)
      form.resetFields()
      loadTemplates()
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败')
    }
  }

  // 查看详情
  const showDetail = (template: Template) => {
    setSelectedTemplate(template)
    setDetailVisible(true)
  }

  // 获取审核状态标签
  const getApprovalStatusTag = (status: string) => {
    switch (status) {
      case 'approved':
        return <Tag color="success" icon={<CheckCircleOutlined />}>已通过</Tag>
      case 'rejected':
        return <Tag color="error" icon={<CloseCircleOutlined />}>已拒绝</Tag>
      case 'pending':
        return <Tag color="warning" icon={<ExclamationCircleOutlined />}>待审核</Tag>
      default:
        return <Tag>未知</Tag>
    }
  }

  const columns: ColumnsType<Template> = [
    {
      title: '模板信息',
      key: 'info',
      width: 350,
      fixed: 'left' as const,
      render: (_, record) => (
        <div className="flex gap-3">
          {/* 缩略图 */}
          <div className="flex-shrink-0">
            {record.thumbnail ? (
              <Image
                src={record.thumbnail}
                width={80}
                height={60}
                className="rounded object-cover"
                preview={false}
              />
            ) : (
              <div className="w-20 h-15 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                无图
              </div>
            )}
          </div>
          
          {/* 信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-base line-clamp-1">{record.name}</span>
              {record.isOfficial && (
                <Tooltip title="官方模板">
                  <CrownOutlined className="text-yellow-500" />
                </Tooltip>
              )}
            </div>
            <div className="text-xs text-gray-500 line-clamp-2 mb-2">
              {record.description}
            </div>
            <Space size="small" wrap>
              <Tag color={TEMPLATE_CATEGORIES[record.category as keyof typeof TEMPLATE_CATEGORIES]?.color || 'default'}>
                {TEMPLATE_CATEGORIES[record.category as keyof typeof TEMPLATE_CATEGORIES]?.label || record.category}
              </Tag>
              <Tag color={QUESTIONNAIRE_TYPE_COLORS[record.type as keyof typeof QUESTIONNAIRE_TYPE_COLORS] || 'default'}>
                {QUESTIONNAIRE_TYPE_NAMES[record.type as keyof typeof QUESTIONNAIRE_TYPE_NAMES] || record.type}
              </Tag>
            </Space>
          </div>
        </div>
      ),
    },
    {
      title: '创建者',
      dataIndex: 'author',
      key: 'author',
      width: 150,
      render: (author, record) => (
        <div>
          <div className="font-medium">{record.authorNickname || author}</div>
          <div className="text-xs text-gray-500">{author}</div>
        </div>
      ),
    },
    {
      title: '审核状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 120,
      render: (status) => getApprovalStatusTag(status),
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date) => (
        <div>
          <div>{dayjs(date).format('YYYY-MM-DD')}</div>
          <div className="text-xs text-gray-500">{dayjs(date).format('HH:mm')}</div>
        </div>
      ),
    },
    {
      title: '拒绝原因',
      dataIndex: 'rejectionReason',
      key: 'rejectionReason',
      width: 200,
      render: (reason) => reason ? (
        <div className="text-xs text-red-600">{reason}</div>
      ) : '-',
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
          >
            查看详情
          </Button>
          {record.approvalStatus === 'pending' && (
            <Button
              type="primary"
              size="small"
              onClick={() => showApproveModal(record)}
            >
              审核
            </Button>
          )}
          {record.approvalStatus !== 'pending' && (
            <Button
              size="small"
              onClick={() => showApproveModal(record)}
            >
              重新审核
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold mb-2">审核中心</h1>
        <p className="text-gray-600">
          审核用户提交的模板，确保内容质量和合规性
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('pending')}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-1">待审核</div>
              <div className="text-2xl font-bold text-orange-500">
                {templates.filter(t => t.approvalStatus === 'pending').length}
              </div>
            </div>
            <ExclamationCircleOutlined className="text-4xl text-orange-500" />
          </div>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('approved')}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-1">已通过</div>
              <div className="text-2xl font-bold text-green-500">
                {templates.filter(t => t.approvalStatus === 'approved').length}
              </div>
            </div>
            <CheckCircleOutlined className="text-4xl text-green-500" />
          </div>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('rejected')}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-1">已拒绝</div>
              <div className="text-2xl font-bold text-red-500">
                {templates.filter(t => t.approvalStatus === 'rejected').length}
              </div>
            </div>
            <CloseCircleOutlined className="text-4xl text-red-500" />
          </div>
        </Card>
      </div>

      {/* 筛选栏 */}
      <div className="flex gap-4 flex-wrap items-center">
        <Search
          placeholder="搜索模板名称或描述"
          allowClear
          style={{ width: 300 }}
          onSearch={handleSearch}
          enterButton={<SearchOutlined />}
        />
        <Radio.Group
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="pending">
            <Badge count={templates.filter(t => t.approvalStatus === 'pending').length} offset={[10, 0]}>
              待审核
            </Badge>
          </Radio.Button>
          <Radio.Button value="approved">已通过</Radio.Button>
          <Radio.Button value="rejected">已拒绝</Radio.Button>
          <Radio.Button value="">全部</Radio.Button>
        </Radio.Group>
        <Button icon={<ReloadOutlined />} onClick={loadTemplates}>
          刷新
        </Button>
      </div>

      {/* 模板表格 */}
      <Table
        columns={columns}
        dataSource={templates}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 1300 }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 个模板`,
          onChange: (page, pageSize) => {
            setPage(page)
            setPageSize(pageSize)
          },
        }}
      />

      {/* 审核弹窗 */}
      <Modal
        title={`审核模板 - ${selectedTemplate?.name}`}
        open={approveModalVisible}
        onCancel={() => {
          setApproveModalVisible(false)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleApprove}
          initialValues={{ action: 'approve' }}
        >
          <Form.Item
            label="审核决定"
            name="action"
            rules={[{ required: true, message: '请选择审核结果' }]}
          >
            <Radio.Group>
              <Radio.Button value="approve">
                <CheckCircleOutlined /> 通过
              </Radio.Button>
              <Radio.Button value="reject">
                <CloseCircleOutlined /> 拒绝
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.action !== currentValues.action}
          >
            {({ getFieldValue }) =>
              getFieldValue('action') === 'reject' ? (
                <Form.Item
                  label="拒绝原因"
                  name="reason"
                  rules={[{ required: true, message: '请输入拒绝原因' }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="请详细说明拒绝的原因，以便作者改进"
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情抽屉 */}
      {selectedTemplate && (
        <TemplateDetailDrawer
          visible={detailVisible}
          template={selectedTemplate}
          onClose={() => {
            setDetailVisible(false)
          }}
          onRefresh={loadTemplates}
        />
      )}
    </div>
  )
}

export default TemplateReviewPage

