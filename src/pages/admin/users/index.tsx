import React, { useEffect, useState } from 'react'
import { Alert, Button, Modal, message } from 'antd'
import { PlusOutlined, SafetyOutlined } from '@ant-design/icons'
import { ROLES } from '@/constants/roles'
import {
  getUsersAPI,
  banUserAPI,
  resetUserPasswordAPI,
  deleteUserAPI,
  getRolesAPI,
  exportUsersAPI,
} from '@/api/modules/admin'
import { useRequest } from 'ahooks'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'

import CreateUserModal from './components/dialog/create-user-modal'
import AssignAccessModal from './components/dialog/assign-access-modal'
import EditUserModal from './components/dialog/edit-user-modal'
import { PermissionControl } from '@/components/permission-guard'
import { PERMISSIONS } from '@/constants/permissions'
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
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [exportLoading, setExportLoading] = useState(false)

  const { _id: currentUserId, role: currentRole } = useGetUserInfo()
  const isSuperAdminUser = currentRole === ROLES.SUPER_ADMIN

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

  const handleExportUsers = async () => {
    try {
      setExportLoading(true)
      message.loading({ content: '正在导出...', key: 'export-users', duration: 0 })

      const data = await exportUsersAPI({
        keyword: keyword || undefined,
        role: roleFilter,
        isBanned: statusFilter === undefined ? undefined : !statusFilter,
      })

      if (!Array.isArray(data) || data.length === 0) {
        message.warning({ content: '没有可导出的数据', key: 'export-users' })
        return
      }

      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '用户数据')
      XLSX.writeFile(
        workbook,
        `用户数据_${dayjs().format('YYYY-MM-DD_HHmmss')}.xlsx`
      )
      message.success({
        content: `已导出 ${data.length} 条用户数据`,
        key: 'export-users',
      })
    } catch (error: any) {
      message.error({
        content: error.response?.data?.message || '导出失败',
        key: 'export-users',
      })
    } finally {
      setExportLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">用户管理</h1>
          <p className="text-gray-600">
            在此为员工分配可访问的<strong>后台页面（路由）</strong>与<strong>按钮权限</strong>
          </p>
        </div>
        <PermissionControl permission={PERMISSIONS.USER_CREATE}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            创建管理员工
          </Button>
        </PermissionControl>
      </div>

      {isSuperAdminUser ? (
        <Alert
          type="info"
          showIcon
          icon={<SafetyOutlined />}
          message="如何分配页面权限？"
          description={
            <ol className="list-decimal list-inside mt-1 space-y-1 text-sm">
              <li>先点右上角「创建管理后台员工」新建 admin 账号</li>
              <li>
                在下方用户列表<strong>操作</strong>列，点该员工行的
                <strong>「分配权限」</strong>（蓝色链接）
              </li>
              <li>在弹窗树形列表中勾选路由（页面）及其下的按钮权限后保存</li>
              <li>「权限目录」菜单仅查看系统预置清单，不能在那里分配</li>
            </ol>
          }
        />
      ) : (
        <Alert
          type="warning"
          showIcon
          message="仅超级管理员可分配页面与按钮权限"
          description="请使用超级管理员账号（admin@quizzyflow.com）登录后，进入本页操作。"
        />
      )}

      <UserFilter
        roles={roles}
        initialValues={{
          keyword,
          role: roleFilter,
          status: statusFilter,
        }}
        onFilterChange={handleFilterChange}
        onRefresh={loadUsers}
        onExport={handleExportUsers}
        exportLoading={exportLoading}
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
        onAssignAccess={(record) => {
          setSelectedUser(record)
          setRoleModalVisible(true)
        }}
        onEditUser={(record) => {
          setSelectedUser(record)
          setEditModalVisible(true)
        }}
        canAssignAccess={isSuperAdminUser}
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

      <EditUserModal
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSuccess={() => {
          setEditModalVisible(false)
          loadUsers()
        }}
        user={selectedUser}
      />

      {isSuperAdminUser && (
        <AssignAccessModal
          open={roleModalVisible}
          onCancel={() => setRoleModalVisible(false)}
          onSuccess={() => {
            setRoleModalVisible(false)
            loadUsers()
            loadRoles()
          }}
          user={selectedUser}
        />
      )}

      <UserDetailDrawer
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        userId={selectedUser?._id}
      />
    </div>
  )
}

export default UsersManagement
