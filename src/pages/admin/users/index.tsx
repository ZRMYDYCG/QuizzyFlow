import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm,
  Drawer,
  Descriptions,
  Badge,
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import {
  getUsersAPI,
  getUserDetailAPI,
  createAdminUserAPI,
  updateUserRoleAPI,
  banUserAPI,
  resetUserPasswordAPI,
  deleteUserAPI,
} from '@/api/modules/admin'
import { getRolesAPI } from '@/api/modules/admin'
import { ROLE_NAMES, ROLE_COLORS } from '@/constants/roles'
import type { ColumnsType } from 'antd/es/table'
import { useRequest } from 'ahooks'

const { Search } = Input

/**
 * 管理后台 - 用户管理
 */
const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [keyword, setKeyword] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>()
  const [statusFilter, setStatusFilter] = useState<boolean>()
  
  const [roles, setRoles] = useState<any[]>([])
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [roleModalVisible, setRoleModalVisible] = useState(false)
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userDetail, setUserDetail] = useState<any>(null)
  
  const [createForm] = Form.useForm()
  const [roleForm] = Form.useForm()

  const { run: loadUsers, loading } = useRequest(
    async () => {
      return await getUsersAPI({
        page,
        pageSize,
        keyword,
        role: roleFilter,
        isActive: statusFilter,
      })
    },
    {
      manual: true,
      onSuccess: (result) => {
        setUsers(result.list || [])
        setTotal(result.total || 0)
      },
      onError: () => {
        message.error('加载用户列表失败')
      },
    }
  )

  const { run: loadRoles } = useRequest(
    async () => {
      return await getRolesAPI()
    },
    {
      manual: true,
      onSuccess: (result) => {
        console.log('👥 加载角色数据:', result)
        console.log('  - result 是数组:', Array.isArray(result))
        console.log('  - result 类型:', typeof result)
        // 确保 result 是数组
        setRoles(Array.isArray(result) ? result : [])
      },
      onError: (error) => {
        console.error('Failed to load roles:', error)
      },
    }
  )

  useEffect(() => {
    loadUsers()
    loadRoles()
  }, [page, pageSize, keyword, roleFilter, statusFilter])

  const handleSearch = (value: string) => {
    setKeyword(value)
    setPage(1)
  }

  const handleCreateUser = async (values: any) => {
    try {
      await createAdminUserAPI(values)
      message.success('用户创建成功')
      setCreateModalVisible(false)
      createForm.resetFields()
      loadUsers()
    } catch (error: any) {
      message.error(error.response?.data?.message || '创建失败')
    }
  }

  const handleUpdateRole = async (values: any) => {
    if (!selectedUser) return
    try {
      await updateUserRoleAPI(selectedUser._id, values)
      message.success('角色更新成功')
      setRoleModalVisible(false)
      roleForm.resetFields()
      loadUsers()
    } catch (error: any) {
      message.error(error.response?.data?.message || '更新失败')
    }
  }

  const handleBanUser = async (user: any) => {
    try {
      const isBanned = !user.isBanned
      await banUserAPI(user._id, {
        isBanned,
        reason: isBanned ? '违规操作' : '解除封禁',
      })
      message.success(isBanned ? '用户已封禁' : '用户已解封')
      loadUsers()
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败')
    }
  }

  const handleResetPassword = (user: any) => {
    Modal.confirm({
      title: '重置密码',
      content: (
        <div>
          <p>确定要重置用户 <strong>{user.nickname}</strong> 的密码吗？</p>
          <p className="text-gray-500 text-sm mt-2">新密码将重置为：123456</p>
        </div>
      ),
      onOk: async () => {
        try {
          await resetUserPasswordAPI(user._id, '123456')
          message.success('密码重置成功')
        } catch (error: any) {
          message.error(error.response?.data?.message || '重置失败')
        }
      },
    })
  }

  const handleDeleteUser = async (user: any) => {
    try {
      await deleteUserAPI(user._id)
      message.success('用户删除成功')
      loadUsers()
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除失败')
    }
  }

  const { run: fetchUserDetail } = useRequest(
    async (userId: string) => {
      return await getUserDetailAPI(userId)
    },
    {
      manual: true,
      onSuccess: (result) => {
        setUserDetail(result)
        setDetailDrawerVisible(true)
      },
      onError: () => {
        message.error('加载用户详情失败')
      },
    }
  )

  const showUserDetail = (user: any) => {
    fetchUserDetail(user._id)
  }

  const columns: ColumnsType<any> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <div>
          <div className="font-medium">{record.nickname}</div>
          <div className="text-xs text-gray-500">{text}</div>
        </div>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={ROLE_COLORS[role as keyof typeof ROLE_COLORS]}>
          {ROLE_NAMES[role as keyof typeof ROLE_NAMES] || role}
        </Tag>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => (
        <Space>
          {record.isActive ? (
            <Badge status="success" text="正常" />
          ) : (
            <Badge status="error" text="停用" />
          )}
          {record.isBanned && <Tag color="red">已封禁</Tag>}
        </Space>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (date) => date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right' as const,
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => showUserDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedUser(record)
              roleForm.setFieldsValue({ role: record.role })
              setRoleModalVisible(true)
            }}
          >
            角色
          </Button>
          <Button
            type="link"
            size="small"
            icon={record.isBanned ? <UnlockOutlined /> : <LockOutlined />}
            danger={!record.isBanned}
            onClick={() => handleBanUser(record)}
          >
            {record.isBanned ? '解封' : '封禁'}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleResetPassword(record)}
          >
            重置密码
          </Button>
          <Popconfirm
            title="确定删除该用户吗？"
            onConfirm={() => handleDeleteUser(record)}
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">用户管理</h1>
          <p className="text-gray-600">管理系统用户和权限</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          创建用户
        </Button>
      </div>

      {/* 筛选栏 */}
      <div className="flex gap-4 flex-wrap">
        <Search
          placeholder="搜索用户名、昵称、手机号"
          allowClear
          style={{ width: 300 }}
          onSearch={handleSearch}
          enterButton={<SearchOutlined />}
        />
        <Select
          placeholder="角色筛选"
          style={{ width: 150 }}
          allowClear
          onChange={setRoleFilter}
        >
          {Array.isArray(roles) && roles.map((role) => (
            <Select.Option key={role.name} value={role.name}>
              {role.displayName}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="状态筛选"
          style={{ width: 150 }}
          allowClear
          onChange={setStatusFilter}
        >
          <Select.Option value={true}>正常</Select.Option>
          <Select.Option value={false}>停用</Select.Option>
        </Select>
        <Button icon={<ReloadOutlined />} onClick={loadUsers}>
          刷新
        </Button>
      </div>

      {/* 用户表格 */}
      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 1200 }}
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

      {/* 创建用户弹窗 */}
      <Modal
        title="创建用户"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false)
          createForm.resetFields()
        }}
        onOk={() => createForm.submit()}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateUser}
        >
          <Form.Item
            label="用户名（邮箱）"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="user@example.com" />
          </Form.Item>
          <Form.Item
            label="昵称"
            name="nickname"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="用户昵称" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password placeholder="至少6位密码" />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="选择角色">
              {Array.isArray(roles) && roles.map((role) => (
                <Select.Option key={role.name} value={role.name}>
                  {role.displayName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="手机号" name="phone">
            <Input placeholder="手机号码（可选）" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改角色弹窗 */}
      <Modal
        title="修改用户角色"
        open={roleModalVisible}
        onCancel={() => {
          setRoleModalVisible(false)
          roleForm.resetFields()
        }}
        onOk={() => roleForm.submit()}
      >
        <Form form={roleForm} layout="vertical" onFinish={handleUpdateRole}>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="选择角色">
              {Array.isArray(roles) && roles.map((role) => (
                <Select.Option key={role.name} value={role.name}>
                  {role.displayName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 用户详情抽屉 */}
      <Drawer
        title="用户详情"
        placement="right"
        width={600}
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
      >
        {userDetail && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="用户名">
              {userDetail.username}
            </Descriptions.Item>
            <Descriptions.Item label="昵称">
              {userDetail.nickname}
            </Descriptions.Item>
            <Descriptions.Item label="角色">
              <Tag color={ROLE_COLORS[userDetail.role as keyof typeof ROLE_COLORS] || 'default'}>
                {ROLE_NAMES[userDetail.role as keyof typeof ROLE_NAMES] || userDetail.role}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="手机号">
              {userDetail.phone || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="个人简介">
              {userDetail.bio || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="创建的问卷">
              {userDetail.statistics?.questionCount || 0} 个
            </Descriptions.Item>
            <Descriptions.Item label="回答的问卷">
              {userDetail.statistics?.answerCount || 0} 个
            </Descriptions.Item>
            <Descriptions.Item label="最后登录">
              {userDetail.lastLoginAt
                ? new Date(userDetail.lastLoginAt).toLocaleString('zh-CN')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="注册时间">
              {new Date(userDetail.createdAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  )
}

export default UsersManagement

