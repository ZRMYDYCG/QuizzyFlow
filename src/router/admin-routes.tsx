import { lazy, Suspense } from 'react'
import { Spin } from 'antd'
import AdminLayout from '@/layouts/admin-layout'
import { PermissionGuard } from '@/components/permission-guard'
import { PERMISSIONS } from '@/constants/permissions'
import { ROLES } from '@/constants/roles'

// 懒加载管理后台页面
const Dashboard = lazy(() => import('@/pages/admin/dashboard'))
const UsersManagement = lazy(() => import('@/pages/admin/users'))
const RolesManagement = lazy(() => import('@/pages/admin/roles'))
const PermissionsManagement = lazy(() => import('@/pages/admin/permissions'))
const QuestionsManagement = lazy(() => import('@/pages/admin/questions'))
// const LogsManagement = lazy(() => import('@/pages/admin/logs'))
const SystemSettings = lazy(() => import('@/pages/admin/settings'))
const AdminNotFound = lazy(() => import('@/pages/admin/not-found'))

// 加载组件
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spin size="large" tip="加载中..." />
  </div>
)

/**
 * 管理后台路由配置
 */
export const adminRoutes = {
  path: 'admin',
  element: <AdminLayout />,
  children: [
    {
      path: 'dashboard',
      element: (
        <PermissionGuard role={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        </PermissionGuard>
      ),
    },
    {
      path: 'users',
      element: (
        <PermissionGuard permission={PERMISSIONS.USER_VIEW_ALL}>
          <Suspense fallback={<LoadingFallback />}>
            <UsersManagement />
          </Suspense>
        </PermissionGuard>
      ),
    },
    {
      path: 'roles',
      element: (
        <PermissionGuard permission={PERMISSIONS.ROLE_VIEW}>
          <Suspense fallback={<LoadingFallback />}>
            <RolesManagement />
          </Suspense>
        </PermissionGuard>
      ),
    },
    {
      path: 'permissions',
      element: (
        <PermissionGuard permission={PERMISSIONS.PERMISSION_VIEW}>
          <Suspense fallback={<LoadingFallback />}>
            <PermissionsManagement />
          </Suspense>
        </PermissionGuard>
      ),
    },
    {
      path: 'questions',
      element: (
        <PermissionGuard permission={PERMISSIONS.QUESTION_VIEW_ALL}>
          <Suspense fallback={<LoadingFallback />}>
            <QuestionsManagement />
          </Suspense>
        </PermissionGuard>
      ),
    },
    // {
    //   path: 'logs',
    //   element: (
    //     <PermissionGuard permission={PERMISSIONS.SYSTEM_LOGS_VIEW}>
    //       <Suspense fallback={<LoadingFallback />}>
    //         <LogsManagement />
    //       </Suspense>
    //     </PermissionGuard>
    //   ),
    // },
    {
      path: 'settings',
      element: (
        <PermissionGuard permission={PERMISSIONS.SYSTEM_CONFIG_VIEW}>
          <Suspense fallback={<LoadingFallback />}>
            <SystemSettings />
          </Suspense>
        </PermissionGuard>
      ),
    },
    {
      path: '*',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminNotFound />
        </Suspense>
      ),
    },
  ],
}

