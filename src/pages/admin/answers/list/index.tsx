/**
 * 管理后台 - 答卷列表
 */
import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Modal,
  message,
  Tooltip,
} from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  ExportOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useRequest } from 'ahooks'
import dayjs from 'dayjs'
import {
  getAdminAnswerList,
  batchDeleteAnswers,
  deleteAnswer,
  markAnswer,
  exportAnswers,
  type Answer,
  type AdminAnswerListParams,
} from '@/api/modules/admin-answer'
import AnswerDetailDrawer from '../components/answer-detail-drawer'
import * as XLSX from 'xlsx'

const { RangePicker } = DatePicker

const AnswerListPage: React.FC = () => {
  // 查询参数
  const [questionId, setQuestionId] = useState('')
  const [keyword, setKeyword] = useState('')
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const [isValid, setIsValid] = useState<boolean | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 数据状态
  const [answers, setAnswers] = useState<Answer[]>([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)

  // 加载答卷列表
  const { loading, run: loadAnswers } = useRequest(
    async () => {
      const params: AdminAnswerListParams = {
        page,
        pageSize,
        questionId: questionId || undefined,
        keyword: keyword || undefined,
        isValid,
        startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
      }

      const res = await getAdminAnswerList(params)
      return res
    },
    {
      manual: false,
      refreshDeps: [page, pageSize, questionId, keyword, dateRange, isValid],
      onSuccess: (res) => {
        setAnswers(res.list)
        setTotal(res.total)
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '加载失败')
      },
    }
  )

  // 查看详情
  const handleViewDetail = (record: Answer) => {
    setSelectedAnswer(record)
    setDetailDrawerVisible(true)
  }

  // 标记答卷
  const handleMark = async (record: Answer, isValid: boolean) => {
    try {
      await markAnswer(record._id, isValid)
      message.success(isValid ? '已标记为正常' : '已标记为异常')
      loadAnswers()
    } catch (error: any) {
      message.error(error.response?.data?.message || '标记失败')
    }
  }

  // 删除单个答卷
  const handleDelete = (record: Answer) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后数据无法恢复，确定要删除这个答卷吗？',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteAnswer(record._id)
          message.success('删除成功')
          loadAnswers()
        } catch (error: any) {
          message.error(error.response?.data?.message || '删除失败')
        }
      },
    })
  }

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的答卷')
      return
    }

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个答卷吗？删除后数据无法恢复。`,
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const result = await batchDeleteAnswers(selectedRowKeys as string[])
          message.success(`成功删除 ${result.deletedCount} 个答卷`)
          setSelectedRowKeys([])
          loadAnswers()
        } catch (error: any) {
          message.error(error.response?.data?.message || '批量删除失败')
        }
      },
    })
  }

  // 导出数据
  const handleExport = async () => {
    try {
      message.loading({ content: '正在导出数据...', key: 'export', duration: 0 })

      const params: AdminAnswerListParams = {
        questionId: questionId || undefined,
        isValid,
        startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
      }

      const data = await exportAnswers(params)

      if (data.length === 0) {
        message.warning({ content: '没有数据可导出', key: 'export' })
        return
      }

      // 使用 xlsx 库导出
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '答卷数据')
      
      const filename = `答卷数据_${dayjs().format('YYYY-MM-DD_HHmmss')}.xlsx`
      XLSX.writeFile(workbook, filename)

      message.success({ content: `成功导出 ${data.length} 条数据`, key: 'export' })
    } catch (error: any) {
      message.error({ content: error.response?.data?.message || '导出失败', key: 'export' })
    }
  }

  // 表格列定义
  const columns: ColumnsType<Answer> = [
    {
      title: '答卷ID',
      dataIndex: '_id',
      key: '_id',
      width: 120,
      ellipsis: true,
      render: (id) => (
        <Tooltip title={id}>
          <span className="font-mono text-xs">{id.slice(-8)}</span>
        </Tooltip>
      ),
    },
    {
      title: '问卷标题',
      dataIndex: 'questionTitle',
      key: 'questionTitle',
      width: 200,
      ellipsis: true,
    },
    {
      title: '创建者',
      dataIndex: 'questionAuthor',
      key: 'questionAuthor',
      width: 120,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 140,
      render: (ip) => ip || '-',
    },
    {
      title: '答题时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      sorter: (a, b) => (a.duration || 0) - (b.duration || 0),
      render: (duration) => (duration ? `${duration}秒` : '-'),
    },
    {
      title: '状态',
      dataIndex: 'isValid',
      key: 'isValid',
      width: 100,
      filters: [
        { text: '正常', value: true },
        { text: '异常', value: false },
      ],
      onFilter: (value, record) => record.isValid === value,
      render: (isValid) =>
        isValid ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            正常
          </Tag>
        ) : (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            异常
          </Tag>
        ),
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          {record.isValid ? (
            <Button
              type="link"
              size="small"
              danger
              onClick={() => handleMark(record, false)}
            >
              标记异常
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              onClick={() => handleMark(record, true)}
            >
              标记正常
            </Button>
          )}
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  }

  return (
    <div className="space-y-4">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold mb-2">答卷列表</h1>
        <p className="text-gray-600">
          查看和管理所有问卷的答卷数据，支持筛选、导出和批量操作
        </p>
      </div>

      {/* 筛选栏 */}
      <div className="flex gap-4 flex-wrap items-center">
        <Input
          placeholder="搜索IP地址或设备信息"
          allowClear
          style={{ width: 250 }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          prefix={<SearchOutlined />}
        />

        <Input
          placeholder="输入问卷ID筛选"
          allowClear
          style={{ width: 200 }}
          value={questionId}
          onChange={(e) => setQuestionId(e.target.value)}
        />

        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates as any)}
          placeholder={['开始日期', '结束日期']}
          style={{ width: 280 }}
        />

        <Select
          placeholder="答卷状态"
          allowClear
          style={{ width: 120 }}
          value={isValid}
          onChange={(value) => setIsValid(value)}
          options={[
            { label: '全部', value: undefined },
            { label: '正常', value: true },
            { label: '异常', value: false },
          ]}
        />

        <Button icon={<ReloadOutlined />} onClick={loadAnswers}>
          刷新
        </Button>

        <Button
          type="primary"
          icon={<ExportOutlined />}
          onClick={handleExport}
          ghost
        >
          导出数据
        </Button>
      </div>

      {/* 批量操作 */}
      {selectedRowKeys.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-blue-700 font-medium">
            已选择 {selectedRowKeys.length} 项
          </span>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleBatchDelete}
          >
            批量删除
          </Button>
          <Button onClick={() => setSelectedRowKeys([])}>取消选择</Button>
        </div>
      )}

      {/* 答卷表格 */}
      <Table
        columns={columns}
        dataSource={answers}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 1400 }}
        rowSelection={rowSelection}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 个答卷`,
          onChange: (page, pageSize) => {
            setPage(page)
            setPageSize(pageSize)
          },
        }}
      />

      {/* 答卷详情抽屉 */}
      {selectedAnswer && (
        <AnswerDetailDrawer
          open={detailDrawerVisible}
          answer={selectedAnswer}
          onClose={() => {
            setDetailDrawerVisible(false)
            setSelectedAnswer(null)
          }}
          onRefresh={loadAnswers}
        />
      )}
    </div>
  )
}

export default AnswerListPage

