import React, { useEffect, useState } from 'react'
import {
  Table,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Button,
  Drawer,
  Descriptions,
} from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { getLogsAPI } from '@/api/modules/admin'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useRequest } from 'ahooks'

const { Search } = Input
const { RangePicker } = DatePicker

/**
 * 管理后台 - 操作日志
 */
const LogsManagement: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  
  const [keyword, setKeyword] = useState('')
  const [moduleFilter, setModuleFilter] = useState<string>()
  const [actionFilter, setActionFilter] = useState<string>()
  const [statusFilter, setStatusFilter] = useState<'success' | 'failed'>()
  const [dateRange, setDateRange] = useState<[string, string]>()
  
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false)
  const [selectedLog, setSelectedLog] = useState<any>(null)

  const { run: loadLogs, loading } = useRequest(
    async () => {
      return await getLogsAPI({
        page,
        pageSize,
        keyword,
        module: moduleFilter,
        action: actionFilter,
        status: statusFilter,
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
      })
    },
    {
      manual: true,
      onSuccess: (result) => {
        console.log('📋 加载日志数据:', result)
        setLogs(Array.isArray(result.list) ? result.list : [])
        setTotal(result.total || 0)
      },
      onError: (error) => {
        console.error('Failed to load logs:', error)
      },
    }
  )

  useEffect(() => {
    loadLogs()
  }, [page, pageSize, keyword, moduleFilter, actionFilter, statusFilter, dateRange])

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) {
      setDateRange(dateStrings)
    } else {
      setDateRange(undefined)
    }
    setPage(1)
  }

  const showLogDetail = (log: any) => {
    setSelectedLog(log)
    setDetailDrawerVisible(true)
  }

  const columns: ColumnsType<any> = [
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 120,
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <Tag color="blue">{record.operatorRole}</Tag>
        </div>
      ),
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 100,
      render: (module) => {
        const colorMap: Record<string, string> = {
          user: 'blue',
          question: 'green',
          role: 'purple',
          permission: 'orange',
          template: 'cyan',
          system: 'red',
        }
        return <Tag color={colorMap[module]}>{module}</Tag>
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (action) => {
        const actionMap: Record<string, string> = {
          create: '创建',
          update: '更新',
          delete: '删除',
          ban: '封禁',
          login: '登录',
          view: '查看',
          export: '导出',
        }
        return actionMap[action] || action
      },
    },
    {
      title: '资源',
      key: 'resource',
      width: 150,
      render: (_, record) => (
        <div>
          <div className="text-sm">{record.resource}</div>
          {record.resourceName && (
            <div className="text-xs text-gray-500">{record.resourceName}</div>
          )}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 'success' ? 'success' : 'error'}>
          {status === 'success' ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 130,
    },
    {
      title: '操作时间',
      dataIndex: 'operatedAt',
      key: 'operatedAt',
      width: 170,
      sorter: (a, b) => new Date(a.operatedAt).getTime() - new Date(b.operatedAt).getTime(),
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right' as const,
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => showLogDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">操作日志</h1>
        <p className="text-gray-600">查看系统操作记录和审计日志</p>
      </div>

      {/* 筛选栏 */}
      <div className="flex gap-4 flex-wrap">
        <Search
          placeholder="搜索操作人或资源"
          allowClear
          style={{ width: 250 }}
          onSearch={(value) => {
            setKeyword(value)
            setPage(1)
          }}
          enterButton={<SearchOutlined />}
        />
        <Select
          placeholder="模块筛选"
          style={{ width: 120 }}
          allowClear
          onChange={(value) => {
            setModuleFilter(value)
            setPage(1)
          }}
        >
          <Select.Option value="user">用户</Select.Option>
          <Select.Option value="question">问卷</Select.Option>
          <Select.Option value="role">角色</Select.Option>
          <Select.Option value="permission">权限</Select.Option>
          <Select.Option value="template">模板</Select.Option>
          <Select.Option value="system">系统</Select.Option>
        </Select>
        <Select
          placeholder="操作筛选"
          style={{ width: 120 }}
          allowClear
          onChange={(value) => {
            setActionFilter(value)
            setPage(1)
          }}
        >
          <Select.Option value="create">创建</Select.Option>
          <Select.Option value="update">更新</Select.Option>
          <Select.Option value="delete">删除</Select.Option>
          <Select.Option value="ban">封禁</Select.Option>
          <Select.Option value="login">登录</Select.Option>
        </Select>
        <Select
          placeholder="状态筛选"
          style={{ width: 120 }}
          allowClear
          onChange={(value) => {
            setStatusFilter(value)
            setPage(1)
          }}
        >
          <Select.Option value="success">成功</Select.Option>
          <Select.Option value="failed">失败</Select.Option>
        </Select>
        <RangePicker
          onChange={handleDateRangeChange}
          format="YYYY-MM-DD"
          style={{ width: 240 }}
        />
        <Button icon={<ReloadOutlined />} onClick={loadLogs}>
          刷新
        </Button>
      </div>

      {/* 日志表格 */}
      <Table
        columns={columns}
        dataSource={logs}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          onChange: (page, pageSize) => {
            setPage(page)
            setPageSize(pageSize)
          },
        }}
      />

      {/* 日志详情抽屉 */}
      <Drawer
        title="日志详情"
        placement="right"
        width={600}
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
      >
        {selectedLog && (
          <div className="space-y-6">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="操作人">
                {selectedLog.operatorName}
              </Descriptions.Item>
              <Descriptions.Item label="角色">
                <Tag color="blue">{selectedLog.operatorRole}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="模块">
                {selectedLog.module}
              </Descriptions.Item>
              <Descriptions.Item label="操作">
                {selectedLog.action}
              </Descriptions.Item>
              <Descriptions.Item label="资源类型">
                {selectedLog.resource}
              </Descriptions.Item>
              <Descriptions.Item label="资源ID">
                {selectedLog.resourceId || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="资源名称">
                {selectedLog.resourceName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedLog.status === 'success' ? 'success' : 'error'}>
                  {selectedLog.status === 'success' ? '成功' : '失败'}
                </Tag>
              </Descriptions.Item>
              {selectedLog.status === 'failed' && (
                <Descriptions.Item label="错误信息">
                  <span className="text-red-500">{selectedLog.errorMessage}</span>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="IP地址">
                {selectedLog.ip}
              </Descriptions.Item>
              <Descriptions.Item label="User Agent">
                <div className="text-xs break-all">{selectedLog.userAgent || '-'}</div>
              </Descriptions.Item>
              <Descriptions.Item label="操作时间">
                {dayjs(selectedLog.operatedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>

            {/* 操作详情 */}
            {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">操作详情</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            )}

            {/* 变更记录 */}
            {selectedLog.changes && (
              <div>
                <h3 className="font-semibold mb-2">变更记录</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedLog.changes.before && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">修改前</div>
                      <pre className="bg-red-50 p-3 rounded text-xs overflow-auto">
                        {JSON.stringify(selectedLog.changes.before, null, 2)}
                      </pre>
                    </div>
                  )}
                  {selectedLog.changes.after && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">修改后</div>
                      <pre className="bg-green-50 p-3 rounded text-xs overflow-auto">
                        {JSON.stringify(selectedLog.changes.after, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default LogsManagement

