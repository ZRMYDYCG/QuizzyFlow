/**
 * 管理后台 - 模板列表页
 */
import React, { useState, useEffect } from 'react'
import { 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Modal, 
  message, 
  Popconfirm,
  Switch,
  Badge,
  Image,
  Tooltip,
} from 'antd'
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
  StarOutlined,
  StarFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CrownOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useRequest } from 'ahooks'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import {
  getAdminTemplateList,
  setTemplateOfficial,
  setTemplateFeatured,
  deleteTemplateAdmin,
  batchDeleteTemplates,
  batchSetFeatured,
} from '@/api/modules/admin-template'
import { TEMPLATE_CATEGORIES } from '@/constants/template-categories'
import { QUESTIONNAIRE_TYPE_NAMES, QUESTIONNAIRE_TYPE_COLORS } from '@/constants/questionnaire-types'
import type { Template } from '@/types/template'
import TemplateDetailDrawer from '../components/template-detail-drawer'

// 配置 dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Search } = Input

const TemplateListPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  
  // 筛选条件
  const [keyword, setKeyword] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>()
  const [typeFilter, setTypeFilter] = useState<string>()
  const [officialFilter, setOfficialFilter] = useState<string>()
  const [featuredFilter, setFeaturedFilter] = useState<string>()
  const [approvalFilter, setApprovalFilter] = useState<string>()
  
  // 选中的模板
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  
  // 详情抽屉
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  // 加载模板列表
  const { run: loadTemplates, loading } = useRequest(
    async () => {
      return await getAdminTemplateList({
        page,
        pageSize,
        keyword,
        category: categoryFilter,
        type: typeFilter,
        isOfficial: officialFilter ? officialFilter === 'true' : undefined,
        isFeatured: featuredFilter ? featuredFilter === 'true' : undefined,
        approvalStatus: approvalFilter as any,
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
  }, [page, pageSize, keyword, categoryFilter, typeFilter, officialFilter, featuredFilter, approvalFilter])

  // 搜索
  const handleSearch = (value: string) => {
    setKeyword(value)
    setPage(1)
  }

  // 切换官方状态
  const handleToggleOfficial = async (template: Template) => {
    try {
      await setTemplateOfficial(template._id, !template.isOfficial)
      message.success(template.isOfficial ? '已取消官方标记' : '已设为官方模板')
      loadTemplates()
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败')
    }
  }

  // 切换精选状态
  const handleToggleFeatured = async (template: Template) => {
    try {
      await setTemplateFeatured(template._id, !template.isFeatured)
      message.success(template.isFeatured ? '已取消精选' : '已设为精选')
      loadTemplates()
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败')
    }
  }

  // 删除模板
  const handleDelete = async (id: string) => {
    try {
      await deleteTemplateAdmin(id)
      message.success('模板已删除')
      loadTemplates()
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除失败')
    }
  }

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的模板')
      return
    }

    Modal.confirm({
      title: '批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个模板吗？此操作不可恢复！`,
      onOk: async () => {
        try {
          await batchDeleteTemplates(selectedRowKeys as string[])
          message.success('批量删除成功')
          setSelectedRowKeys([])
          loadTemplates()
        } catch (error: any) {
          message.error(error.response?.data?.message || '批量删除失败')
        }
      },
    })
  }

  // 批量设为精选
  const handleBatchSetFeatured = (isFeatured: boolean) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择模板')
      return
    }

    Modal.confirm({
      title: isFeatured ? '批量设为精选' : '批量取消精选',
      content: `确定要对选中的 ${selectedRowKeys.length} 个模板进行操作吗？`,
      onOk: async () => {
        try {
          await batchSetFeatured(selectedRowKeys as string[], isFeatured)
          message.success('批量操作成功')
          setSelectedRowKeys([])
          loadTemplates()
        } catch (error: any) {
          message.error(error.response?.data?.message || '批量操作失败')
        }
      },
    })
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
        return <Tag color="warning">待审核</Tag>
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
              {record.isFeatured && (
                <Tooltip title="精选模板">
                  <StarFilled className="text-yellow-500" />
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
      width: 110,
      render: (status) => getApprovalStatusTag(status),
    },
    {
      title: '数据统计',
      key: 'statistics',
      width: 150,
      render: (_, record) => (
        <div className="space-y-1 text-sm">
          <div>使用: <span className="font-semibold text-blue-600">{record.useCount || 0}</span></div>
          <div>点赞: <span className="font-semibold text-red-600">{record.likeCount || 0}</span></div>
          <div>浏览: <span className="font-semibold text-green-600">{record.viewCount || 0}</span></div>
        </div>
      ),
    },
    {
      title: '创建时间',
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
      title: '官方',
      key: 'official',
      width: 70,
      render: (_, record) => (
        <Switch
          checked={record.isOfficial}
          checkedChildren="是"
          unCheckedChildren="否"
          onChange={() => handleToggleOfficial(record)}
        />
      ),
    },
    {
      title: '精选',
      key: 'featured',
      width: 70,
      render: (_, record) => (
        <Switch
          checked={record.isFeatured}
          checkedChildren={<StarFilled />}
          unCheckedChildren={<StarOutlined />}
          onChange={() => handleToggleFeatured(record)}
        />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
          >
            详情
          </Button>
          <Popconfirm
            title="删除模板"
            description="确定要删除此模板吗？"
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  return (
    <div className="space-y-4">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold mb-2">模板列表</h1>
        <p className="text-gray-600">
          管理模板市场中的所有模板，包括官方模板和用户提交的模板
        </p>
      </div>

      {/* 筛选栏 */}
      <div className="flex gap-4 flex-wrap">
        <Search
          placeholder="搜索模板名称或描述"
          allowClear
          style={{ width: 300 }}
          onSearch={handleSearch}
          enterButton={<SearchOutlined />}
        />
        <Select
          placeholder="分类筛选"
          style={{ width: 150 }}
          allowClear
          onChange={setCategoryFilter}
        >
          {Object.values(TEMPLATE_CATEGORIES).filter(cat => cat.key !== 'all').map((cat) => (
            <Select.Option key={cat.key} value={cat.key}>
              {cat.emoji} {cat.label}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="问卷类型"
          style={{ width: 150 }}
          allowClear
          onChange={setTypeFilter}
        >
          {Object.entries(QUESTIONNAIRE_TYPE_NAMES).map(([key, label]) => (
            <Select.Option key={key} value={key}>
              {label as string}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="官方模板"
          style={{ width: 120 }}
          allowClear
          onChange={setOfficialFilter}
        >
          <Select.Option value="true">是</Select.Option>
          <Select.Option value="false">否</Select.Option>
        </Select>
        <Select
          placeholder="精选模板"
          style={{ width: 120 }}
          allowClear
          onChange={setFeaturedFilter}
        >
          <Select.Option value="true">是</Select.Option>
          <Select.Option value="false">否</Select.Option>
        </Select>
        <Select
          placeholder="审核状态"
          style={{ width: 120 }}
          allowClear
          onChange={setApprovalFilter}
        >
          <Select.Option value="approved">已通过</Select.Option>
          <Select.Option value="pending">待审核</Select.Option>
          <Select.Option value="rejected">已拒绝</Select.Option>
        </Select>
        <Button icon={<ReloadOutlined />} onClick={loadTemplates}>
          刷新
        </Button>
      </div>

      {/* 批量操作栏 */}
      {selectedRowKeys.length > 0 && (
        <div className="bg-blue-50 p-4 rounded flex items-center justify-between">
          <span className="text-sm">
            已选中 <span className="font-semibold text-blue-600">{selectedRowKeys.length}</span> 个模板
          </span>
          <Space>
            <Button
              icon={<StarFilled />}
              onClick={() => handleBatchSetFeatured(true)}
            >
              批量设为精选
            </Button>
            <Button
              icon={<StarOutlined />}
              onClick={() => handleBatchSetFeatured(false)}
            >
              批量取消精选
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleBatchDelete}
            >
              批量删除
            </Button>
          </Space>
        </div>
      )}

      {/* 模板表格 */}
      <Table
        columns={columns}
        dataSource={templates}
        rowKey="_id"
        loading={loading}
        rowSelection={rowSelection}
        scroll={{ x: 1500 }}
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

      {/* 详情抽屉 */}
      {selectedTemplate && (
        <TemplateDetailDrawer
          visible={detailVisible}
          template={selectedTemplate}
          onClose={() => {
            setDetailVisible(false)
            setSelectedTemplate(null)
          }}
          onRefresh={loadTemplates}
        />
      )}
    </div>
  )
}

export default TemplateListPage

