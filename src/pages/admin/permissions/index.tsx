import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Card,
  message,
  Collapse,
  Badge,
} from 'antd'
import {
  SafetyOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import {
  getPermissionsAPI,
  getGroupedPermissionsAPI,
  initializePermissionsAPI,
} from '@/api/modules/admin'
import type { ColumnsType } from 'antd/es/table'
import { useRequest } from 'ahooks'

const { Search } = Input
const { Panel } = Collapse

/**
 * 管理后台 - 权限管理
 */
const PermissionsManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<any[]>([])
  const [groupedPermissions, setGroupedPermissions] = useState<any>({})
  const [moduleFilter, setModuleFilter] = useState<string>()
  const [keyword, setKeyword] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('grouped')

  const { run: loadPermissions, loading } = useRequest(
    async () => {
      const [listRes, groupedRes] = await Promise.all([
        getPermissionsAPI({ module: moduleFilter, keyword }),
        getGroupedPermissionsAPI(),
      ])
      return { listRes, groupedRes }
    },
    {
      manual: true,
      onSuccess: (result) => {
        console.log('🔐 加载权限数据:', result)
        setPermissions(Array.isArray(result.listRes) ? result.listRes : [])
        setGroupedPermissions(result.groupedRes || {})
      },
      onError: () => {
        message.error('加载权限列表失败')
      },
    }
  )

  useEffect(() => {
    loadPermissions()
  }, [moduleFilter, keyword])

  const handleInitialize = async () => {
    try {
      await initializePermissionsAPI()
      message.success('系统权限初始化成功')
      loadPermissions()
    } catch (error: any) {
      message.error(error.response?.data?.message || '初始化失败')
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: '权限代码',
      dataIndex: 'code',
      key: 'code',
      width: 250,
      render: (code) => <code className="text-xs bg-gray-100 px-2 py-1 rounded">{code}</code>,
    },
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '所属模块',
      dataIndex: 'module',
      key: 'module',
      render: (module) => <Tag color="blue">{module}</Tag>,
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      key: 'action',
      render: (action) => {
        const colorMap: Record<string, string> = {
          view: 'green',
          create: 'blue',
          update: 'orange',
          delete: 'red',
          manage: 'purple',
        }
        return <Tag color={colorMap[action] || 'default'}>{action}</Tag>
      },
    },
    {
      title: '类型',
      dataIndex: 'isSystem',
      key: 'isSystem',
      render: (isSystem) => (
        <Badge
          status={isSystem ? 'error' : 'success'}
          text={isSystem ? '系统权限' : '自定义权限'}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? '启用' : '禁用'}
        </Tag>
      ),
    },
  ]

  const modules = Array.from(new Set(permissions.map((p) => p.module)))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">权限管理</h1>
          <p className="text-gray-600">管理系统权限列表</p>
        </div>
        <Space>
          <Button
            icon={<SyncOutlined />}
            onClick={handleInitialize}
          >
            初始化系统权限
          </Button>
          <Button
            type={viewMode === 'list' ? 'primary' : 'default'}
            onClick={() => setViewMode('list')}
          >
            列表视图
          </Button>
          <Button
            type={viewMode === 'grouped' ? 'primary' : 'default'}
            onClick={() => setViewMode('grouped')}
          >
            分组视图
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Card>
        <div className="flex gap-8">
          <div>
            <div className="text-gray-600 text-sm">总权限数</div>
            <div className="text-2xl font-bold mt-1">{permissions.length}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">系统权限</div>
            <div className="text-2xl font-bold mt-1">
              {permissions.filter((p) => p.isSystem).length}
            </div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">自定义权限</div>
            <div className="text-2xl font-bold mt-1">
              {permissions.filter((p) => !p.isSystem).length}
            </div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">模块数量</div>
            <div className="text-2xl font-bold mt-1">{modules.length}</div>
          </div>
        </div>
      </Card>

      {/* 筛选栏 */}
      <div className="flex gap-4">
        <Search
          placeholder="搜索权限代码或名称"
          allowClear
          style={{ width: 300 }}
          onSearch={setKeyword}
        />
        <Select
          placeholder="按模块筛选"
          style={{ width: 200 }}
          allowClear
          onChange={setModuleFilter}
        >
          {modules.map((module) => (
            <Select.Option key={module} value={module}>
              {module.toUpperCase()}
            </Select.Option>
          ))}
        </Select>
        <Button icon={<ReloadOutlined />} onClick={loadPermissions}>
          刷新
        </Button>
      </div>

      {/* 列表视图 */}
      {viewMode === 'list' && (
        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="code"
          loading={loading}
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      )}

      {/* 分组视图 */}
      {viewMode === 'grouped' && (
        <Collapse
          defaultActiveKey={Object.keys(groupedPermissions)}
          expandIconPosition="end"
        >
          {Object.entries(groupedPermissions).map(([module, perms]: [string, any]) => {
            const permArray = Array.isArray(perms) ? perms : []
            return (
              <Panel
                key={module}
                header={
                  <div className="flex items-center gap-3">
                    <SafetyOutlined className="text-blue-500" />
                    <span className="font-semibold">{module.toUpperCase()}</span>
                    <Badge count={permArray.length} showZero color="blue" />
                  </div>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {permArray.map((perm: any) => (
                    <Card key={perm.code} size="small" hoverable>
                      <div className="flex items-start gap-2">
                        <CheckCircleOutlined className="text-green-500 mt-1" />
                        <div className="flex-1">
                          <div className="font-medium mb-1">{perm.name}</div>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded block mb-2">
                            {perm.code}
                          </code>
                          <div className="text-xs text-gray-600">{perm.description}</div>
                          <div className="mt-2">
                            <Tag color="blue">{perm.action}</Tag>
                            {perm.isSystem && (
                              <Tag color="red">系统</Tag>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Panel>
            )
          })}
        </Collapse>
      )}
    </div>
  )
}

export default PermissionsManagement

