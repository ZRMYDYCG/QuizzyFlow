import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Modal,
  Tree,
  Select,
  message,
  Spin,
  Alert,
  Divider,
  Checkbox,
  Collapse,
} from 'antd'
import type { DataNode } from 'antd/es/tree'
import {
  getUserAccessBoundsAPI,
  updateUserAccessAPI,
  type UserAccessBounds,
} from '@/api/modules/admin'
import { clampToRolePermissions } from '@/utils/permission-bounds'
import type { AdminRouteNode } from '@/constants/access-registry'
import type { AdminPermissionGroup } from '@/constants/admin-assignable'
import { ROLES } from '@/constants/roles'

interface AssignAccessModalProps {
  open: boolean
  onCancel: () => void
  onSuccess: () => void
  user: any
}

function buildRouteTreeData(nodes: AdminRouteNode[]): DataNode[] {
  return nodes.map((node) => ({
    key: node.path,
    title: node.name,
    children: node.children?.length
      ? buildRouteTreeData(node.children)
      : undefined,
  }))
}

const AssignAccessModal: React.FC<AssignAccessModalProps> = ({
  open,
  onCancel,
  onSuccess,
  user,
}) => {
  const [bounds, setBounds] = useState<UserAccessBounds | null>(null)
  const [loadingBounds, setLoadingBounds] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [checkedRoutes, setCheckedRoutes] = useState<string[]>([])
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([])
  const [accountType, setAccountType] = useState<'staff' | 'user'>('staff')

  const routes = (bounds?.routes as AdminRouteNode[]) || []
  const permissionGroups =
    (bounds?.permissions as AdminPermissionGroup[]) || []
  const roleCeilingList = bounds?.rolePermissions || []
  const roleLabel = bounds?.roleDisplayName || user?.role || ''

  const routeTreeData = useMemo(() => buildRouteTreeData(routes), [routes])

  const roleCeiling = useMemo(
    () => new Set<string>(roleCeilingList),
    [roleCeilingList]
  )

  const assignablePermissionGroups = useMemo(
    () =>
      permissionGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => roleCeiling.has(item.code)),
        }))
        .filter((group) => group.items.length > 0),
    [permissionGroups, roleCeiling]
  )

  const allPermissionCodes = useMemo(
    () => assignablePermissionGroups.flatMap((g) => g.items.map((i) => i.code)),
    [assignablePermissionGroups]
  )

  const clampSelection = useCallback(
    (codes: string[]) => clampToRolePermissions(codes, roleCeilingList),
    [roleCeilingList]
  )

  const setPermissionsSafe = useCallback(
    (codes: string[]) => {
      setCheckedPermissions(clampSelection(codes))
    },
    [clampSelection]
  )

  useEffect(() => {
    if (!open) {
      setBounds(null)
      setCheckedRoutes([])
      setCheckedPermissions([])
      setAccountType('staff')
      return
    }

    if (!user?._id) return

    let cancelled = false
    const load = async () => {
      setLoadingBounds(true)
      setBounds(null)
      try {
        const data = await getUserAccessBoundsAPI(user._id)
        if (cancelled) return
        setBounds(data)
        setAccountType(data.role === 'user' ? 'user' : 'staff')
        setCheckedRoutes(data.grantedRoutes || [])
        setCheckedPermissions(data.grantedButtons || [])
      } catch {
        if (!cancelled) message.error('加载该用户的权限上限失败')
      } finally {
        if (!cancelled) setLoadingBounds(false)
      }
    }
    load()

    return () => {
      cancelled = true
    }
  }, [open, user?._id])

  const handlePermissionGroupChange = (groupCodes: string[], checked: boolean) => {
    setCheckedPermissions((prev) => {
      const set = new Set(clampSelection(prev))
      groupCodes.forEach((code) => {
        if (!roleCeiling.has(code)) return
        if (checked) set.add(code)
        else set.delete(code)
      })
      return [...set]
    })
  }

  const handleOk = async () => {
    if (!user) return
    if (user.role === ROLES.SUPER_ADMIN) {
      message.warning('超级管理员权限不可修改')
      return
    }

    const safeButtons = clampSelection(checkedPermissions)
    if (safeButtons.length !== checkedPermissions.length) {
      message.warning('已自动移除超出角色权限范围的操作权限')
      setCheckedPermissions(safeButtons)
    }

    try {
      setSubmitting(true)
      const payload: Parameters<typeof updateUserAccessAPI>[1] = {
        grantedRoutes: accountType === 'staff' ? checkedRoutes : [],
        grantedButtons: accountType === 'staff' ? safeButtons : [],
      }
      if (accountType === 'user') {
        payload.role = 'user'
      } else if (user.role === 'user') {
        payload.role = 'admin'
      }

      await updateUserAccessAPI(user._id, payload)
      message.success('分配成功')
      onSuccess()
    } catch (error: any) {
      message.error(error.response?.data?.message || error.message || '分配失败')
    } finally {
      setSubmitting(false)
    }
  }

  const isSuperAdminUser = user?.role === ROLES.SUPER_ADMIN
  const boundsReady = !!bounds && !loadingBounds

  return (
    <Modal
      title={`分配访问 — ${user?.nickname || ''}`}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={submitting}
      width={720}
      okButtonProps={{
        disabled: isSuperAdminUser || (accountType === 'staff' && !boundsReady),
      }}
      destroyOnClose
    >
      {isSuperAdminUser ? (
        <Alert
          type="info"
          showIcon
          message="该用户为系统唯一的超级管理员，拥有全部权限且不可删除或修改。"
          className="mb-4"
        />
      ) : (
        <>
          <div className="mb-4">
            <span className="text-gray-600 mr-2">账号类型：</span>
            <Select
              value={accountType}
              style={{ width: 200 }}
              onChange={setAccountType}
              options={[
                { value: 'staff', label: '管理后台员工' },
                { value: 'user', label: '普通用户（收回后台权限）' },
              ]}
            />
          </div>

          {accountType === 'staff' && (
            <Spin spinning={loadingBounds}>
              {boundsReady && (
                <Alert
                  type="info"
                  showIcon
                  className="mb-3"
                  message={
                    <>
                      当前所属角色：<strong>{roleLabel}</strong>（
                      <code className="text-xs">{bounds?.role}</code>）· 操作权限上限{' '}
                      <strong>
                        {bounds?.rolePermissionCount ?? roleCeilingList.length}
                      </strong>{' '}
                      项（与角色管理列表数量一致）· 已分配{' '}
                      <strong>{bounds?.grantedButtonCount ?? 0}</strong> 项
                    </>
                  }
                />
              )}

              <div className="mb-2 font-medium text-gray-800">页面路由</div>
              <p className="text-gray-500 text-sm mb-2">
                控制左侧菜单与页面是否可进入，与下方操作权限无关。
              </p>
              <Tree
                checkable
                defaultExpandAll
                disabled={!boundsReady}
                treeData={routeTreeData}
                checkedKeys={checkedRoutes}
                onCheck={(keys) => {
                  const list = Array.isArray(keys) ? keys : keys.checked
                  setCheckedRoutes(list.map(String))
                }}
              />

              <Divider />

              <div className="mb-2 font-medium text-gray-800">操作权限</div>
              <p className="text-gray-500 text-sm mb-3">
                仅能分配角色「{roleLabel}」在角色管理中已勾选的操作权限，列表由服务端实时计算。
              </p>
              {boundsReady && roleCeiling.size === 0 && (
                <Alert
                  type="warning"
                  showIcon
                  className="mb-3"
                  message="该角色未配置任何操作权限，请先在角色管理中为角色勾选权限后再分配。"
                />
              )}
              {boundsReady && roleCeiling.size > 0 && (
                <Collapse
                  defaultActiveKey={assignablePermissionGroups.map((g) => g.module)}
                  items={assignablePermissionGroups.map((group) => {
                    const groupCodes = group.items.map((i) => i.code)
                    const checkedCount = groupCodes.filter((c) =>
                      checkedPermissions.includes(c)
                    ).length
                    const allChecked =
                      groupCodes.length > 0 && checkedCount === groupCodes.length
                    const indeterminate =
                      checkedCount > 0 && checkedCount < groupCodes.length

                    return {
                      key: group.module,
                      label: (
                        <Checkbox
                          indeterminate={indeterminate}
                          checked={allChecked}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handlePermissionGroupChange(groupCodes, e.target.checked)
                          }
                        >
                          {group.moduleName}
                          <span className="text-gray-400 text-xs ml-2">
                            ({checkedCount}/{groupCodes.length})
                          </span>
                        </Checkbox>
                      ),
                      children: (
                        <Checkbox.Group
                          className="flex flex-col gap-2"
                          value={checkedPermissions.filter((c) =>
                            groupCodes.includes(c)
                          )}
                          options={group.items.map((item) => ({
                            label: (
                              <span>
                                {item.name}
                                <span className="text-gray-400 text-xs ml-1">
                                  ({item.code})
                                </span>
                              </span>
                            ),
                            value: item.code,
                          }))}
                          onChange={(vals) => {
                            const next = new Set(
                              clampSelection(checkedPermissions)
                            )
                            groupCodes.forEach((code) => next.delete(code))
                            vals.forEach((code) => {
                              const c = String(code)
                              if (roleCeiling.has(c)) next.add(c)
                            })
                            setCheckedPermissions([...next])
                          }}
                        />
                      ),
                    }
                  })}
                />
              )}

              {boundsReady && roleCeiling.size > 0 && (
                <div className="mt-3 flex gap-2">
                  <a
                    className="text-sm"
                    onClick={() => setPermissionsSafe(allPermissionCodes)}
                  >
                    全选（角色上限内）
                  </a>
                  <a className="text-sm" onClick={() => setPermissionsSafe([])}>
                    清空权限
                  </a>
                </div>
              )}
            </Spin>
          )}
        </>
      )}
    </Modal>
  )
}

export default AssignAccessModal
