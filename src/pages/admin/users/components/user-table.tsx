import React from 'react'
import { Table, Button, Space, Tag, Popconfirm, Badge } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { ROLE_NAMES, ROLE_COLORS } from '@/constants/roles'

interface UserTableProps {
  loading: boolean
  dataSource: any[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number, pageSize: number) => void
  onViewDetail: (record: any) => void
  onEditRole: (record: any) => void
  onBanUser: (record: any) => void
  onResetPassword: (record: any) => void
  onDeleteUser: (record: any) => void
}

const UserTable: React.FC<UserTableProps> = ({
  loading,
  dataSource,
  total,
  page,
  pageSize,
  onPageChange,
  onViewDetail,
  onEditRole,
  onBanUser,
  onResetPassword,
  onDeleteUser,
}) => {
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
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => onViewDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEditRole(record)}
          >
            角色
          </Button>
          <Button
            type="link"
            size="small"
            icon={record.isBanned ? <UnlockOutlined /> : <LockOutlined />}
            danger={!record.isBanned}
            onClick={() => onBanUser(record)}
          >
            {record.isBanned ? '解封' : '封禁'}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => onResetPassword(record)}
          >
            重置密码
          </Button>
          <Popconfirm
            title="确定删除该用户吗？"
            onConfirm={() => onDeleteUser(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
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
