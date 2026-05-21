import React from 'react'
import { Table, Button, Space, Tag, Popconfirm, Badge } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { ROLE_NAMES, ROLE_COLORS, ROLES } from '@/constants/roles'
import { PermissionControl } from '@/components/permission-guard'
import { PERMISSIONS } from '@/constants/permissions'

interface UserTableProps {
  loading: boolean
  dataSource: any[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number, pageSize: number) => void
  onViewDetail: (record: any) => void
  onAssignAccess: (record: any) => void
  canAssignAccess?: boolean
  onEditUser: (record: any) => void
  onBanUser: (record: any) => void
  onResetPassword: (record: any) => void
  onDeleteUser: (record: any) => void
  currentUserId?: string
}

const UserTable: React.FC<UserTableProps> = ({
  loading,
  dataSource,
  total,
  page,
  pageSize,
  onPageChange,
  onViewDetail,
  onAssignAccess,
  onEditUser,
  onBanUser,
  onResetPassword,
  onDeleteUser,
  currentUserId,
  canAssignAccess = false,
}) => {
  const isProtectedUser = (record: any) => record.role === ROLES.SUPER_ADMIN
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
      title: '页面 / 权限',
      key: 'grantedAccess',
      width: 140,
      render: (_, record) => {
        if (record.role === ROLES.SUPER_ADMIN) {
          return <Tag color="red">全部</Tag>
        }
        if (record.role === ROLES.USER) {
          return <span className="text-gray-400">—</span>
        }
        const routeCount = record.grantedRoutes?.length ?? 0
        const permCount =
          record.grantedButtons?.length ?? record.customPermissions?.length ?? 0
        return (
          <Space size={4}>
            <Tag color={routeCount > 0 ? 'blue' : 'default'}>
              {routeCount > 0 ? `${routeCount} 页` : '0 页'}
            </Tag>
            <Tag color={permCount > 0 ? 'green' : 'default'}>
              {permCount > 0 ? `${permCount} 权` : '0 权'}
            </Tag>
          </Space>
        )
      },
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => (
        <Space>
          {record.isBanned ? (
            <Badge status="error" text="已封禁" />
          ) : (
            <Badge status="success" text="正常" />
          )}
        </Space>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (date) => (date ? new Date(date).toLocaleString('zh-CN') : '-'),
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
      width: 360,
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="link"
            size="small"
            onClick={() => onViewDetail(record)}
          >
            详情
          </Button>
          <PermissionControl permission={PERMISSIONS.USER_UPDATE}>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              disabled={isProtectedUser(record)}
              onClick={() => onEditUser(record)}
            >
              编辑
            </Button>
          </PermissionControl>
          {canAssignAccess && record.role !== ROLES.SUPER_ADMIN && (
            <Button
              type="primary"
              size="small"
              ghost
              icon={<EditOutlined />}
              onClick={() => onAssignAccess(record)}
            >
              分配权限
            </Button>
          )}
          <PermissionControl permission={PERMISSIONS.USER_BAN}>
            <Button
              type="link"
              size="small"
              icon={record.isBanned ? <UnlockOutlined /> : <LockOutlined />}
              danger={!record.isBanned}
              disabled={isProtectedUser(record)}
              onClick={() => onBanUser(record)}
            >
              {record.isBanned ? '解封' : '封禁'}
            </Button>
          </PermissionControl>
          <PermissionControl permission={PERMISSIONS.USER_RESET_PASSWORD}>
            <Button
              type="link"
              size="small"
              disabled={isProtectedUser(record)}
              onClick={() => onResetPassword(record)}
            >
              重置密码
            </Button>
          </PermissionControl>
          <PermissionControl permission={PERMISSIONS.USER_DELETE}>
            <Popconfirm
              title="确定删除该用户吗？"
              onConfirm={() => onDeleteUser(record)}
              okText="确定"
              cancelText="取消"
              disabled={
                record._id === currentUserId || isProtectedUser(record)
              }
            >
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                disabled={
                  record._id === currentUserId || isProtectedUser(record)
                }
              >
                删除
              </Button>
            </Popconfirm>
          </PermissionControl>
        </Space>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
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
        onChange: onPageChange,
      }}
    />
  )
}

export default UserTable
