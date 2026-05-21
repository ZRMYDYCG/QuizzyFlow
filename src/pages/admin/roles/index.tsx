import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Tree,
  Spin,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import {
  getRolesAPI,
  createRoleAPI,
  updateRoleAPI,
  deleteRoleAPI,
  setRolePermissionsAPI,
  getRoleStatisticsAPI,
} from '@/api/modules/admin'
import { getAccessRegistryAPI } from '@/api/modules/admin'
import type { AdminPermissionGroup } from '@/constants/admin-assignable'
import { normalizeStaffRolePermissions } from '@/constants/admin-assignable'
import type { ColumnsType } from 'antd/es/table'
import type { DataNode } from 'antd/es/tree'
import { useRequest } from 'ahooks'
import { isStaffRole } from '@/utils/permission-bounds'

const { Search } = Input

/**
 * 管理后台 - 角色管理
 */
const RolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [keyword, setKeyword] = useState('')
  
  const [modalVisible, setModalVisible] = useState(false)
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [selectedRole, setSelectedRole] = useState<any>(null)
  
  const [permissionCatalog, setPermissionCatalog] = useState<AdminPermissionGroup[]>(
    []
  )
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  
  const [form] = Form.useForm()

  const { run: loadRoles, loading } = useRequest(
    async () => {
      return await getRolesAPI({ keyword })
    },
    {
      manual: true,
      onSuccess: (result) => {
        console.log('🎭 加载角色数据:', result)
        console.log('  - result 是数组:', Array.isArray(result))
        console.log('  - result 类型:', typeof result)
        // 确保 result 是数组
        setRoles(Array.isArray(result) ? result : [])
      },
      onError: () => {
        message.error('加载角色列表失败')
      },
    }
  )

  const { run: loadStatistics } = useRequest(
    async () => {
      return await getRoleStatisticsAPI()
    },
    {
      manual: true,
      onSuccess: (result) => {
        setStatistics(result)
      },
      onError: (error) => {
        console.error('Failed to load statistics:', error)
      },
    }
  )

  const { run: loadPermissions, loading: permissionsLoading } = useRequest(
    async () => {
      const data = await getAccessRegistryAPI()
      return Array.isArray(data?.permissions) ? data.permissions : []
    },
    {
      manual: true,
      onSuccess: (result) => {
        setPermissionCatalog(result as AdminPermissionGroup[])
      },
      onError: () => {
        message.error('加载权限列表失败')
      },
    }
  )

  useEffect(() => {
    loadRoles()
    loadStatistics()
  }, [])

  const handleCreate = () => {
    setEditingRole(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (role: any) => {
    setEditingRole(role)
    form.setFieldsValue(role)
    setModalVisible(true)
  }

  const handleSubmit = async (values: any) => {
    try {
      if (editingRole) {
        await updateRoleAPI(editingRole._id, values)
        message.success('角色更新成功')
      } else {
        await createRoleAPI(values)
        message.success('角色创建成功')
      }
      setModalVisible(false)
      form.resetFields()
      loadRoles()
      loadStatistics()
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败')
    }
  }

  const handleDelete = async (role: any) => {
    try {
      await deleteRoleAPI(role._id)
      message.success('角色删除成功')
      loadRoles()
      loadStatistics()
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除失败')
    }
  }

  const handleManagePermissions = async (role: any) => {
    setSelectedRole(role)
    const stored = role.permissions || []
    setSelectedPermissions(
      isStaffRole(role.name) ? normalizeStaffRolePermissions(stored) : stored.filter((c: string) => c.includes(':'))
    )
    await loadPermissions()
    setPermissionModalVisible(true)
  }

  const normalizePermissionKeys = (keys: string[] | React.Key[]): string[] => {
    const codes = keys.map(String).filter((k) => k.includes(':'))
    return selectedRole && isStaffRole(selectedRole.name)
      ? normalizeStaffRolePermissions(codes)
      : codes
  }

  const countRolePermissions = (role: { name: string; permissions?: string[] }) => {
    const stored = role.permissions || []
    return isStaffRole(role.name)
      ? normalizeStaffRolePermissions(stored).length
      : stored.filter((c: string) => c.includes(':')).length
  }

  const handleSavePermissions = async () => {
    if (!selectedRole) return
    try {
      const codes = normalizePermissionKeys(selectedPermissions)
      await setRolePermissionsAPI(selectedRole._id, codes)
      message.success('权限设置成功')
      setPermissionModalVisible(false)
      loadRoles()
    } catch (error: any) {
      message.error(error.response?.data?.message || '设置失败')
    }
  }

  const permissionsToTreeData = (): DataNode[] => {
    return permissionCatalog.map((group) => ({
      title: group.moduleName,
      key: group.module,
      children: group.items.map((item) => ({
        title: `${item.name} (${item.code})`,
        key: item.code,
      })),
    }))
  }

  const columns: ColumnsType<any> = [
    {
      title: '角色名称',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.name}</div>
        </div>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '权限数量',
      dataIndex: 'permissions',
      key: 'permissionsCount',
      render: (permissions, record) => (
        <Tag color="blue">{countRolePermissions(record)} 个权限</Tag>
      ),
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count) => <span>{count || 0}</span>,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => a.priority - b.priority,
    },
    {
      title: '类型',
      dataIndex: 'isSystem',
      key: 'isSystem',
      render: (isSystem) => (
        <Tag color={isSystem ? 'red' : 'green'}>
          {isSystem ? '系统角色' : '自定义角色'}
        </Tag>
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
    {
      title: '操作',
      key: 'actions',
      fixed: 'right' as const,
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.isSystem}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SafetyOutlined />}
            onClick={() => handleManagePermissions(record)}
          >
            权限
          </Button>
          {!record.isSystem && (
            <Popconfirm
              title="确定删除该角色吗？"
              description="删除后无法恢复"
              onConfirm={() => handleDelete(record)}
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
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">角色管理</h1>
          <p className="text-gray-600">管理系统角色和权限分配</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          创建角色
        </Button>
      </div>

      {/* 统计卡片 */}
      {statistics && (
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <div className="text-gray-600 text-sm">总角色数</div>
              <div className="text-2xl font-bold mt-2">{statistics.total}</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="text-gray-600 text-sm">系统角色</div>
              <div className="text-2xl font-bold mt-2">{statistics.system}</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="text-gray-600 text-sm">自定义角色</div>
              <div className="text-2xl font-bold mt-2">{statistics.custom}</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="text-gray-600 text-sm">启用角色</div>
              <div className="text-2xl font-bold mt-2">{statistics.active}</div>
            </Card>
          </Col>
        </Row>
      )}

      {/* 搜索栏 */}
      <div className="flex gap-4">
        <Search
          placeholder="搜索角色名称或描述"
          allowClear
          style={{ width: 300 }}
          onSearch={(value) => {
            setKeyword(value)
            loadRoles()
          }}
        />
        <Button icon={<ReloadOutlined />} onClick={loadRoles}>
          刷新
        </Button>
      </div>

      {/* 角色表格 */}
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />

      {/* 创建/编辑角色弹窗 */}
      <Modal
        title={editingRole ? '编辑角色' : '创建角色'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="角色标识"
            name="name"
            rules={[
              { required: true, message: '请输入角色标识' },
              { pattern: /^[a-z_]+$/, message: '只能包含小写字母和下划线' },
            ]}
          >
            <Input placeholder="例如: content_admin" disabled={!!editingRole} />
          </Form.Item>
          <Form.Item
            label="显示名称"
            name="displayName"
            rules={[{ required: true, message: '请输入显示名称' }]}
          >
            <Input placeholder="例如: 内容管理员" />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea
              placeholder="角色描述"
              rows={3}
            />
          </Form.Item>
          <Form.Item
            label="优先级"
            name="priority"
            initialValue={10}
            rules={[{ required: true, message: '请输入优先级' }]}
          >
            <Input type="number" placeholder="数字越大优先级越高" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限管理弹窗 */}
      <Modal
        title={`管理权限 - ${selectedRole?.displayName}`}
        open={permissionModalVisible}
        onCancel={() => setPermissionModalVisible(false)}
        onOk={handleSavePermissions}
        width={800}
      >
        <Spin spinning={permissionsLoading}>
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">
              已选择{' '}
              <span className="font-bold text-blue-500">
                {normalizePermissionKeys(selectedPermissions).length}
              </span>{' '}
              个权限（与「用户管理 → 分配权限」同一目录）
            </div>
          </div>
          <Tree
            checkable
            defaultExpandAll
            checkedKeys={selectedPermissions}
            onCheck={(checkedKeys: any) => {
              const list = Array.isArray(checkedKeys)
                ? checkedKeys
                : checkedKeys.checked
              setSelectedPermissions(normalizePermissionKeys(list))
            }}
            treeData={permissionsToTreeData()}
          />
        </Spin>
      </Modal>
    </div>
  )
}

export default RolesManagement

