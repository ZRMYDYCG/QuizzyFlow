import React, { useEffect, useState } from 'react'
import { Button, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  getUsersAPI,
  banUserAPI,
  resetUserPasswordAPI,
  deleteUserAPI,
  getRolesAPI,
} from '@/api/modules/admin'
import { useRequest } from 'ahooks'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'

import CreateUserModal from './components/dialog/create-user-modal'
import UpdateRoleModal from './components/dialog/update-role-modal'
import UserDetailDrawer from './components/dialog/user-detail-drawer'
import UserFilter, { FilterValue } from './components/user-filter'
import UserTable from './components/user-table'

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

  const { _id: currentUserId } = useGetUserInfo()

  const { run: loadUsers, loading } = useRequest(
    async () => {
      return await getUsersAPI({
        page,
        pageSize,
        keyword,
        role: roleFilter,
        isBanned: statusFilter === undefined ? undefined : !statusFilter,
      })
    },
    {
      manual: true,
      onSuccess: (result) => {
        setUsers(result.list || [])
        setTotal(result.total || 0)
      },
      onError: (error) => {
        console.error('加载用户列表失败', error)
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

  const handleFilterChange = (values: FilterValue) => {
    if (values.keyword !== undefined) setKeyword(values.keyword)
    if (values.role !== undefined) setRoleFilter(values.role)
    if (values.status !== undefined) setStatusFilter(values.status)
    setPage(1)
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
      console.error(error)
    }
  }

  const handleResetPassword = (user: any) => {
    Modal.confirm({
      title: '重置密码',
      content: (
        <div>
          <p>
            确定要重置用户 <strong>{user.nickname}</strong> 的密码吗？
          </p>
          <p className="text-gray-500 text-sm mt-2">新密码将重置为：123456</p>
        </div>
      ),
      onOk: async () => {
        try {
          await resetUserPasswordAPI(user._id, '123456')
          message.success('密码重置成功')
        } catch (error: any) {
          console.error(error)
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
      console.error(error)
    }
  }

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

      <UserFilter
        roles={roles}
        initialValues={{
          keyword,
          role: roleFilter,
          status: statusFilter,
        }}
        onFilterChange={handleFilterChange}
        onRefresh={loadUsers}
      />

      <UserTable
        loading={loading}
        dataSource={users}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={(p, ps) => {
          setPage(p)
          setPageSize(ps)
        }}
        onViewDetail={(record) => {
          setSelectedUser(record)
          setDetailDrawerVisible(true)
        }}
        onEditRole={(record) => {
          setSelectedUser(record)
          setRoleModalVisible(true)
        }}
        onBanUser={handleBanUser}
        onResetPassword={handleResetPassword}
        onDeleteUser={handleDeleteUser}
        currentUserId={currentUserId}
      />

      <CreateUserModal
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={() => {
          setCreateModalVisible(false)
          loadUsers()
        }}
        roles={roles}
      />

      <UpdateRoleModal
        open={roleModalVisible}
        onCancel={() => setRoleModalVisible(false)}
        onSuccess={() => {
          setRoleModalVisible(false)
          loadUsers()
        }}
        user={selectedUser}
        roles={roles}
      />

      <UserDetailDrawer
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        userId={selectedUser?._id}
      />
    </div>
  )
}

export default UsersManagement
